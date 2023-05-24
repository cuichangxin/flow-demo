<template>
  <div class="canvas_item" :class="{ 'out_height': isOut }">
    <el-tabs v-if="tabList.length" v-model="TabsValue" type="card" :closable="true" @tab-click="handlerTabsClick"
      @tab-remove="handlerTabsRemove">
      <el-tab-pane :key="item.label" v-for="item in tabList" :label="item.label" :name="item.key">
      </el-tab-pane>
    </el-tabs>
    <!-- 画布 -->
    <div id="graph" class="canvas" ref="graphRef"
      :style="{ borderRadius: tabList.length ? '0 0 10px 10px' : '10px', height: tabList.length ? 'calc(100% - 40px)' : '100%' }">
    </div>
  </div>
</template>
<script setup>
import G6 from "@antv/g6";
import registerFactory from "welabx-g6";
import _ from "lodash";
import { getImgSize, fittingString } from '@/utils/utils'

const instance = getCurrentInstance()
instance.proxy.$bus.on('*', (name, val) => {
  if (name == 'updateNode') {
    const model = val
    // model.label = fittingString(model.label, 80, 12)
    graph.updateItem(nodeItem.value, model)
    // 保存数据
    saveG6Json()
  }
  if (name == 'showCanvasData') {
    if (JSON.stringify(val.g6Node) !== "{}") {
      graphData.value = val.g6Node
    } else {
      graphData.value = { nodes: [], edges: [] }
    }
    selectId.value = val.id // 左侧菜单当前选中的节点id
    tabList.value.forEach((item) => {
      if (item.id === val.id) {
        TabsValue.value = item.key
      }
    })
    graph.destroy()
    createGraphic()
    initGraphEvent()
    g6Size()
    // model.setNodeConfig(g)
  }
  if (name == 'resize') {
    if (val !== undefined) {
      isOut.value = val
    }
    setTimeout(() => {
      const h = graphRef.value.clientHeight
      const w = graphRef.value.clientWidth
      graph.changeSize(w, h)
      // 画布移动到中心
      graph.fitCenter()
    }, 300)
  }
  if (name == 'addTab') {
    if (tabList.value.length) {
      let has = tabList.value.some((item) => {
        return item.id === val.id
      })
      if (has) {
        tabList.value.forEach((d) => {
          if (d.id === val.id) {
            TabsValue.value = d.key
          }
        })
      } else {
        tabList.value.push({
          key: (tabList.value.length + 1).toString(),
          ...val
        })
        TabsValue.value = tabList.value.length.toString()
      }
    } else {
      tabList.value.push({
        key: "1",
        ...val
      })
      TabsValue.value = tabList.value.length.toString()
      nextTick(() => {
        const h = graphRef.value.clientHeight
        const w = graphRef.value.clientWidth
        graph.changeSize(w, h)
        // 画布移动到中心
        graph.fitCenter()
      })
    }
  }
})
const isOut = ref(false)

let graph = null // g6实例信息
const graphData = ref({
  nodes: [],
  edges: [],
})
const nodeItem = ref(null) // 点击节点的信息
const selectId = ref('')
const idSort = ref({}) // 控制每个节点的id
const tabList = ref([])
const TabsValue = ref('')
const graphRef = ref(null)

// G6默认配置
const createGraphic = () => {
  const grid = new G6.Grid()
  const cfg = registerFactory(G6, {
    container: "graph",
    width: graphRef.value.clientWidth,
    height: graphRef.value.clientHeight,
    layout: {
      type: "", // 位置将固定
    },
    // 所有节点默认配置
    defaultNode: {
      type: "rect-node",
      style: {
        radius: 5,
        width: 100,
        height: 50,
        cursor: "move",
        fill: "#ecf3ff",
      },
      labelCfg: {
        fontSize: 20,
        style: {
          cursor: "move",
        },
      },
    },
    // 所有边的默认配置
    defaultEdge: {
      type: "polyline-edge", // 扩展了内置边, 有边的事件
      style: {
        radius: 5,
        offset: 15,
        stroke: "#aab7c3",
        lineAppendWidth: 10, // 防止线太细没法点中
        endArrow: true,
      },
    },
    // 覆盖全局样式
    nodeStateStyles: {
      "nodeState:default": {
        opacity: 1,
        fill: "#ecf3ff",
      },
      "nodeState:hover": {
        opacity: 0.8,
      },
      "nodeState:selected": {
        opacity: 0.9,
        fill: "#6db5ee",
      },
    },
    // 默认边不同状态下的样式集合
    edgeStateStyles: {
      "edgeState:default": {
        stroke: "#aab7c3",
      },
      "edgeState:selected": {
        stroke: "#1890FF",
      },
      "edgeState:hover": {
        animate: true,
        animationType: "dash",
        stroke: "#1890FF",
      },
    },
    modes: {
      // 支持的 behavior
      default: ["drag-canvas", "drag-shadow-node", "canvas-event", "delete-item", "select-node", "hover-node", "active-edge", "zoom-canvas"],
      originDrag: ["drag-canvas", "drag-node", "canvas-event", "delete-item", "select-node", "hover-node", "active-edge"],
    },
    plugins: [grid]
  })

  graph = new G6.Graph(cfg)
  graph.read(graphData.value) // 读取数据
  window.$welabxG6 = graph
}
// 初始化图事件
const initGraphEvent = () => {
  // 拖动右侧菜单项节点进入画布
  graph.on("drop", (e) => {
    const { originalEvent } = e
    if (originalEvent.dataTransfer) {
      const transferData = originalEvent.dataTransfer.getData("dragComponent")
      if (transferData) {
        addNode(transferData, e)
      }
    }
  })

  // 拖定节点的事件
  graph.on("node:drop", (e) => {
    e.item.getOutEdges().forEach((edge) => {
      edge.clearStates("edgeState")
    })
    saveG6Json()
  })

  // 选中节点后的事件
  graph.on("after-node-selected", (e) => {
    if (e && e.item) {
      const models = e.item.get("model")
      nodeItem.value = e.item
      instance.proxy.$bus.emit('tableConfig', models)
    }
  })

  // 节点双击事件
  graph.on("after-node-dblclick", (e) => {
    if (e && e.item) {
      const models = e.item.get("model")
      selectId.value = models.id
      instance.proxy.$bus.emit('aloneNode', models)
      // changeCanvas() // 切换定义双击节点的画布
      if (tabList.value.length) {
        let has = tabList.value.some((item) => {
          return item.id === models.id
        })
        if (has) {
          tabList.value.forEach((d) => {
            if (d.id === models.id) {
              TabsValue.value = d.key
            }
          })
        } else {
          tabList.value.push({
            key: (tabList.value.length + 1).toString(),
            ...models
          })
        }
      } else {
        tabList.value.push({
          key: "1",
          ...models
        })
        nextTick(() => {
          const h = graphRef.value.clientHeight
          const w = graphRef.value.clientWidth
          graph.changeSize(w, h)
          // 画布移动到中心
          graph.fitCenter()
        })
      }
      instance.proxy.$bus.emit('showCanvasData', models)
      TabsValue.value = tabList.value.length.toString()
    }
  })
  // 鼠标移入节点的事件
  graph.on("on-node-mouseenter", (e) => {
    if (e && e.item) {
      e.item.getOutEdges().forEach((edge) => {
        edge.clearStates("edgeState")
        edge.setState("edgeState", "hover")
      })
    }
  })

  // 鼠标拖拽到画布外时特殊处理
  graph.on("canvas:mouseleave", (e) => {
    graph.getNodes().forEach((x) => {
      const group = x.getContainer()
      group.clearAnchor()
      x.clearStates("anchorActived")
    })
  })
  // 鼠标移出节点清除边的效果
  graph.on("on-node-mouseleave", (e) => {
    if (e && e.item) {
      e.item.getOutEdges().forEach((edge) => {
        edge.clearStates("edgeState")
      })
    }
  })
  // 删除节点
  graph.on("before-node-removed", ({ target, callback }) => {
    callback(true)
    saveG6Json()
  })
  // 选中边后更新边的样式
  graph.on("after-edge-selected", (e) => {
    if (e && e.item) {
      graph.updateItem(e.item, {
        // shape: 'line-edge',
        style: {
          radius: 10,
          lineWidth: 2,
        },
      })
    }
  })
  // 添加边的事件
  graph.on("before-edge-add", ({ source, target, sourceAnchor, targetAnchor }) => {
    setTimeout(() => {
      graph.addItem("edge", {
        id: `${+new Date() + (Math.random() * 10000).toFixed(0)}`,
        source: source.get("id"),
        target: target.get("id"),
        sourceAnchor,
        targetAnchor,
        // label:  '',
      });
      saveG6Json()
      tabSave()
    }, 100)
  })
  // 节点拖动结束的事件
  graph.on("on-node-dragend", (e) => {
    if (e && e.item) {
      saveG6Json()
    }
  })
}
// 添加节点
const addNode = (transferData, e) => {
  // if (!Object.prototype.hasOwnProperty.call(idSort.value, selectId.value)) {
  //   idSort.value[selectId.value] = 1
  // } else {
  //   idSort.value[selectId.value]++
  // }
  const { img } = JSON.parse(transferData)
  if (img) {
    getImgSize(img).then((res) => {
      formatAddNode(transferData, e, { w: res.width, h: res.height })
    })
  } else {
    formatAddNode(transferData, e, { w: 0, h: 0 })
  }
}

const formatAddNode = (transferData, { x, y }, { w, h }) => {
  const { label, shape, fill, id, img } = JSON.parse(transferData);
  const models = {
    label: fittingString(label, 80, 12),
    // id: `${selectId.value}-${idSort.value[selectId.value]}`,
    id: `${+new Date() + (Math.random() * 10000).toFixed(0)}`,
    type: shape == "image" ? "" : shape,
    style: {
      fill: shape == "image" ? '' : fill || "#ecf3ff",
      radius: shape == "image" ? 0 : 5,
      width: shape == "image" ? w : 100,
      height: shape == "image" ? h : 50,
      lineWidth: shape == "image" ? 0 : 2
    },
    labelCfg: {
      opacity: shape == 'image' ? 0 : 1
    },
    nodeStateStyles: {
      "nodeState:default": {
        opacity: 1,
        fill: fill ? fill : img ? '' : '#ecf3ff'
      },
      "nodeState:hover": {
        opacity: 0.8,
      },
      "nodeState:selected": {
        opacity: 0.9,
        fill: fill ? fill : img ? '' : '#6db5ee',
      },
    },
    x,
    y,
    logoIcon: {
      show: shape == "image" ? true : false,
      x: -(w / 2),
      y: -(h / 2),
      img: img,
      width: w,
      height: h,
    },
    desc: '',
    input: '',
    output: '',
    g6Node: {},
    children: [],
    trackList: [],
  }
  graph.addItem('node', models)
  instance.proxy.$bus.emit('addNodes', models)
  saveG6Json()
  tabSave()
}

// 画布屏幕自适应
const g6Size = () => {
  window.addEventListener("resize", () => {
    setTimeout(() => {
      const h = graphRef.value.clientHeight
      const w = graphRef.value.clientWidth
      graph.changeSize(w, h)
      // 画布移动到中心
      graph.fitCenter()
    }, 100)
  })
}
// 保存画布数据
const saveG6Json = () => {
  instance.proxy.$bus.emit('saveData', graph.save())
}
const handlerTabsClick = (tab) => {
  // console.log(tab);
  const T = tab.props.name
  tabList.value.forEach((item) => {
    if (item.key === T) {
      selectId.value = item.id
      instance.proxy.$bus.emit('showCanvasData', item)
      instance.proxy.$bus.emit('aloneNode', item)
    }
  })
}
const handlerTabsRemove = (targetName) => {
  let tabs = tabList.value
  let activeName = TabsValue.value
  if (activeName === targetName) {
    tabs.forEach((item, index) => {
      if (item.key === targetName) {
        let nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.key
          instance.proxy.$bus.emit('showCanvasData', nextTab)
          instance.proxy.$bus.emit('aloneNode', nextTab)
        }
      }
    })
  }
  TabsValue.value = activeName
  tabList.value = tabs.filter((tab) => tab.key !== targetName);
  // this.saveG6Json();
}
const tabSave = () => {
  if (tabList.value.length) {
    tabList.value.forEach(tab => {
      if (tab.id === selectId.value) {
        tab.g6Node = graph.save()
      }
    })
  }
}
onMounted(() => {
  nextTick(() => {
    createGraphic()
    initGraphEvent()
    g6Size()
  })
})
onUnmounted(() => {
  graph.destroy()
  window.removeEventListener('resize', () => { })
})
</script>
<style lang="scss" scoped>
.canvas_item {
  width: 100%;
  height: calc(100% - 275px);
  transition: height .2s linear;

  &.out_height {
    height: calc(100% - 10px);
  }
}

.canvas {
  width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  position: relative;
  z-index: 1;
}

:deep(.el-tabs--card) {
  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__content {
    padding: 0;
  }

  .is-active {
    background-color: #fff;
  }
}
</style>