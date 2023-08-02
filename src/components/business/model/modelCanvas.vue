<template>
  <div class="canvas_item" :class="{ out_height: isOut }">
    <el-tabs
      v-if="tabList.length"
      v-model="TabsValue"
      type="card"
      :closable="true"
      @tab-click="handlerTabsClick"
      @tab-remove="handlerTabsRemove"
    >
      <el-tab-pane :key="item.label" v-for="item in tabList" :label="item.label" :name="item.key"> </el-tab-pane>
    </el-tabs>
    <!-- 画布 -->
    <div
      v-loading="loading"
      element-loading-text="加载中..."
      id="graph"
      class="canvas"
      ref="graphRef"
      :style="{ height: tabList.length ? 'calc(100% - 40px)' : '100%' }"
    >
      <flowEditor :nodeConfig="nodeConfig" :edge="edge" :isSelect="isSelect" @changeNode="changeNode"></flowEditor>
      <div id="graph-container" class="graph-container"></div>
    </div>
    <!-- 小地图 -->
    <div
      class="minimap_dialog"
      :style="{ left: `${minimapPoint.x}px`, top: `${minimapPoint.y}px`, visibility: minimapMark ? '' : 'hidden' }"
    >
      <header class="mxWindowTitle" @mousedown="minimapDrop">
        <span>缩略图</span>
        <el-button link @click="closeMap">
          <el-icon class="close" size="15">
            <CloseBold />
          </el-icon>
        </el-button>
      </header>
      <div class="minimap" id="minimap"></div>
    </div>
  </div>
</template>
<script setup>
import _ from 'lodash'
import { getImgSize } from '@/utils/utils'

import { Graph, Shape } from '@antv/x6'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { MiniMap } from '@antv/x6-plugin-minimap'
import insertCss from 'insert-css'
import { CloseBold } from '@element-plus/icons-vue'

import flowEditor from '@/components/common/flowEditor/index.vue'

const instance = getCurrentInstance()
instance.proxy.$bus.on('*', (name, val) => {
  if (name == 'updateNode') {
    if (JSON.stringify(val) !== '{}') {
      nodeItem.value.attr({
        text: {
          text: val.label,
        },
        desc: val.desc,
        input: val.input,
        node: val.node,
        output: val.output,
        trackList: val.trackList,
      })
    }
  }
  if (name == 'showCanvasData') {
    if (val.node && JSON.stringify(val.node) !== '{}') {
      graphData.value = val.node
    } else {
      graphData.value = {}
    }
    selectId.value = val.id // 左侧菜单当前选中的节点id

    // 销毁画布
    graph.dispose()
    createGraphic()
    initGraphEvent()
  }
  if (name == 'resize') {
    if (val !== undefined) {
      isOut.value = val
    }
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
          ...val,
        })
        TabsValue.value = tabList.value.length.toString()
      }
    } else {
      tabList.value.push({
        key: '1',
        ...val,
      })
      TabsValue.value = tabList.value.length.toString()
    }
  }
  if (name === 'dragStart') {
    dragStart(val)
  }
  if (name === 'undo') {
    if (graph.canUndo()) {
      graph.undo()
    }
  }
  if (name === 'redo') {
    if (graph.canRedo()) {
      graph.redo()
    }
  }
  if (name === 'contraction') {
    isOut.value = val
  }
  if (name === 'minimap') {
    minimapMark.value = !minimapMark.value
    if (minimapMark.value === false) {
      minimapPoint.x = 87
      minimapPoint.y = 50
    }
  }
  if (name === 'saveFile') {
    instance.proxy.$axios
      .saveTaskDetail({
        taskId: 2003,
        daTree: JSON.stringify(graph.toJSON()),
      })
      .then((res) => {
        console.log(res)
      })
  }
  if (name === 'regen') {
    loading.value = true
    graph.dispose()
    graphData.value = {}
    createGraphic()
    initGraphEvent()
    loading.value = false
  }
})
const isOut = ref(false)
const nodeConfig = ref({})
// 绝对定位连接桩
const absolutePorts = {
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
  },
  items: [
    {
      group: 'top',
    },
    {
      group: 'right',
    },
    {
      group: 'bottom',
    },
    {
      group: 'left',
    },
  ],
}

// 多个连接桩
const ports = {
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
  },
  items: [
    {
      id: 'prot1',
      group: 'top',
    },
    {
      id: 'prot2',
      group: 'top',
    },
    {
      id: 'prot3',
      group: 'top',
    },
    {
      id: 'prot4',
      group: 'top',
    },
    {
      id: 'prot5',
      group: 'left',
    },
    {
      id: 'prot6',
      group: 'left',
    },
    {
      id: 'prot7',
      group: 'left',
    },
    {
      id: 'prot8',
      group: 'left',
    },
    {
      id: 'prot9',
      group: 'right',
    },
    {
      id: 'prot10',
      group: 'right',
    },
    {
      id: 'prot11',
      group: 'right',
    },
    {
      id: 'prot12',
      group: 'right',
    },
    {
      id: 'prot13',
      group: 'bottom',
    },
    {
      id: 'prot14',
      group: 'bottom',
    },
    {
      id: 'prot15',
      group: 'bottom',
    },
    {
      id: 'prot16',
      group: 'bottom',
    },
  ],
}
// 椭圆连接桩
const ellipsePorts = {
  groups: {
    ellipse: {
      position: {
        name: 'ellipseSpread',
        args: {
          start: 45,
        },
      },
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          width: 10,
          height: 10,
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
  },
}
const dragItem = ref({})

let graph = null // g6实例信息
const graphData = ref({})
const nodeItem = ref(null) // 点击节点的信息
const selectId = ref('')
const tabList = ref([])
const TabsValue = ref('')
const graphRef = ref(null)
const minimapPoint = reactive({
  x: '',
  y: '',
})
// 小地图开关
const minimapMark = ref(false)
const loading = ref(true)
const subGraph = ref({})
const isSelect = ref(false)
const edge = ref({})

// 开始拖动
const dragStart = (item) => {
  dragItem.value = item
  // 元素行为 移动
  graphRef.value.addEventListener('dragenter', dragenter)
  // 目标元素经过 禁止默认事件
  graphRef.value.addEventListener('dragover', dragover)
  // 离开目标元素设置元素的放置行为  不能拖放
  graphRef.value.addEventListener('dragleave', dragleave)
  // 拖动元素在目标元素松手时添加元素到画布
  graphRef.value.addEventListener('drop', drop)
}
const dragenter = (e) => {
  e.dataTransfer.dropEffect = 'move'
}
const dragover = (e) => {
  e.preventDefault()
}
const dragleave = (e) => {
  e.dataTransfer.dropEffect = 'none'
}
// 控制连接桩显示/隐藏
const showPorts = (ports, show) => {
  for (let i = 0, len = ports.length; i < len; i += 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden'
  }
}

// 拖动松开添加节点
const drop = (e) => {
  const point = graph.clientToLocal(e.clientX, e.clientY)
  if (dragItem.value.img) {
    getImgSize(dragItem.value.img).then((res) => {
      const node = graph.addNode({
        shape: dragItem.value.shape,
        x: point.x,
        y: point.y,
        width: res.width,
        height: res.height,
        label: dragItem.value.label,
        attrs: {
          image: {
            'xlink:href': dragItem.value.img,
          },
          label: {
            refX: 0.5, // 标题水平位置
            refY: '100%', // 标题垂直位置
            refY2: 6, // 标题和节点之间的距离
            textAnchor: 'middle',
            textVerticalAnchor: 'top',
            fontSize: 12,
            fill: '#333',
          },
        },
        ports: { ...absolutePorts },
        desc: '',
        input: '',
        output: '',
        node: {},
        children: [],
        trackList: [],
      })
      instance.proxy.$bus.emit('addNodes', node)
      saveG6Json()
    })
  } else {
    const node = graph.addNode({
      shape: dragItem.value.shape !== undefined ? dragItem.value.shape : 'custom-rect',
      x: point.x,
      y: point.y,
      label: dragItem.value.label,
      attrs: {
        label: {
          fontSize: 12,
          fill: '#333',
        },
        body: {
          // stroke: '#ffa940',
          // fill: '#ffd591',
          // rx: 10,
          // ry: 10,
        },
      },
      desc: '',
      input: '',
      output: '',
      node: {},
      children: [],
      trackList: [],
    })
    if (dragItem.value.shape === 'custom-ellipse') {
      Array.from({ length: 10 }).forEach((_, index) => {
        node.addPort({
          id: `${index}`,
          group: 'ellipse',
        })
      })
    }
    instance.proxy.$bus.emit('addNodes', node)
    saveG6Json()
  }

  graphRef.value.removeEventListener('dragenter', dragenter)
  graphRef.value.removeEventListener('dragover', dragover)
  graphRef.value.removeEventListener('dragleave', dragleave)
  graphRef.value.removeEventListener('drop', drop)
  setTimeout(() => {
    dragItem.value = null
  }, 400)
}

// 初始化创建画布
const createGraphic = () => {
  // #region 构建自定义图形
  // 平行四边形
  Graph.registerNode(
    'custom-polygon-quad',
    {
      inherit: 'polygon',
      width: 100,
      height: 60,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#333',
          fill: '#fff',
          refPoints: '10,0 40,0 30,20 0,20',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
      ports: {
        ...absolutePorts,
        items: [
          {
            group: 'top',
          },
          {
            group: 'bottom',
          },
        ],
      },
    },
    true
  )
  // 菱形
  Graph.registerNode(
    'custom-polygon-rhombus',
    {
      inherit: 'polygon',
      width: 100,
      height: 60,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#333',
          fill: '#fff',
          refPoints: '0,10 10,0 20,10 10,20',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
      ports: { ...absolutePorts },
    },
    true
  )
  // 矩形
  Graph.registerNode(
    'custom-rect',
    {
      inherit: 'rect',
      width: 100,
      height: 70,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#333',
          fill: '#fff',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
      ports: { ...absolutePorts },
    },
    true
  )
  // 圆形
  Graph.registerNode(
    'custom-circle',
    {
      inherit: 'circle',
      width: 50,
      height: 50,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#333',
          fill: '#fff',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
      ports: { ...absolutePorts },
    },
    true
  )
  // 椭圆
  Graph.registerNode(
    'custom-ellipse',
    {
      inherit: 'ellipse',
      width: 100,
      height: 70,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#333',
          fill: '#fff',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
      ports: { ...ellipsePorts },
    },
    true
  )
  // #endregion
  const parentDom = document.getElementById('graph')
  const graphDom = document.getElementById('graph-container')
  graph = new Graph({
    container: graphDom,
    width: parentDom.clientWidth,
    height: parentDom.clientHeight,
    grid: {
      visible: true,
      type: 'doubleMesh',
      args: [
        {
          color: '#eee', // 主网格线颜色
          thickness: 1, // 主网格线宽度
        },
        {
          color: '#ddd', // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 4, // 主次网格线间隔
        },
      ],
    },
    panning: {
      enabled: true, // 开启拖拽平移
    },
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
    },
    connecting: {
      router: 'manhattan',
      // connector: 'rounded',
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      snap: {
        radius: 20,
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#000',
              strokeWidth: 2,
              sourceMarker: {
                name: '',
              },
              targetMarker: {
                name: 'block',
              },
            },
          },
          zIndex: 0,
        })
      },
      validateConnection({ targetMagnet }) {
        return !!targetMagnet
      },
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#5F95FF',
            stroke: '#5F95FF',
          },
        },
      },
    },
  })
  // 使用插件
  graph
    .use(
      new Transform({
        resizing: true,
        rotating: true,
      })
    )
    .use(
      new Selection({
        rubberband: true,
        showNodeSelectionBox: true,
        modifiers: ['ctrl', 'meta'], // 防止拖拽平移冲突，配合快键键框选
      })
    )
    .use(new Snapline())
    .use(new Keyboard())
    .use(new Clipboard())
    .use(
      new History({
        enabled: true,
      })
    )
    .use(
      new MiniMap({
        container: document.getElementById('minimap'),
        width: document.getElementById('minimap').clientWidth,
        height: document.getElementById('minimap').clientHeight,
      })
    )

  // 快捷键事件
  graph.bindKey(['meta+c', 'ctrl+c'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.copy(cells)
    }
    return false
  })
  graph.bindKey(['meta+x', 'ctrl+x'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.cut(cells)
    }
    return false
  })
  graph.bindKey(['meta+v', 'ctrl+v'], () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 })
      graph.cleanSelection()
      graph.select(cells)
    }
    return false
  })

  // undo redo
  graph.bindKey(['meta+z', 'ctrl+z'], () => {
    if (graph.canUndo()) {
      graph.undo()
    }
    return false
  })
  graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
    if (graph.canRedo()) {
      graph.redo()
    }
    return false
  })

  // select all
  graph.bindKey(['meta+a', 'ctrl+a'], () => {
    const nodes = graph.getNodes()
    if (nodes) {
      graph.select(nodes)
    }
  })

  // delete
  graph.bindKey('backspace', () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.removeCells(cells)
    }
  })

  // zoom
  graph.bindKey(['ctrl+1', 'meta+1'], () => {
    const zoom = graph.zoom()
    if (zoom < 1.5) {
      graph.zoom(0.1)
    }
  })
  graph.bindKey(['ctrl+2', 'meta+2'], () => {
    const zoom = graph.zoom()
    if (zoom > 0.5) {
      graph.zoom(-0.1)
    }
  })
  insertCss(`
    #container {
      display: flex;
      border: 1px solid #dfe3e8;
    }
    #stencil {
      width: 180px;
      height: 100%;
      position: relative;
      border-right: 1px solid #dfe3e8;
    }
    #graph-container {
      width: calc(100% - 180px);
      height: 100%;
    }
    .x6-widget-stencil  {
      background-color: #fff;
    }
    .x6-widget-stencil-title {
      background-color: #fff;
    }
    .x6-widget-stencil-group-title {
      background-color: #fff !important;
    }
    .x6-widget-transform {
      margin: -1px 0 0 -1px;
      padding: 0px;
      border:2px solid #3572f9;
      box-shadow:0 4px 4px 0 #dbe6ff;
    }
    .x6-widget-transform > div {
      border: 1px solid #3572f9;
    }
    .x6-widget-transform > div:hover {
      background-color: #3572f9;
    }
    .x6-widget-transform-active-handle {
      background-color: #3572f9;
    }
    .x6-widget-transform-resize {
      border-radius: 0;
    }
    .x6-widget-selection-inner {
      border: 1px solid #3572f9;
    }
    .x6-widget-selection-box {
      opacity: 0;
    }
    .x6-port>circle{
      stroke:#69c0ff;
      stroke-width:2;
    }
    .x6-edge:hover path:nth-child(2){
      stroke: #1890ff;
    }
  `)

  if (Object.keys(graphData.value).length) {
    graph.fromJSON(graphData.value.cells)
    graph.centerContent()
  }
}
// 初始化图事件
const initGraphEvent = () => {
  graph.on('node:mouseenter', (e) => {
    const container = document.getElementById('graph-container')
    const ports = container.querySelectorAll('.x6-port-body')
    showPorts(ports, true)
  })
  graph.on('node:mouseleave', (e) => {
    const container = document.getElementById('graph-container')
    const ports = container.querySelectorAll('.x6-port-body')
    showPorts(ports, false)
  })
  graph.on('node:click', (e) => {
    nodeItem.value = e.node
    isSelect.value = true
    const container = document.getElementById('graph-container')
    const ports = container.querySelectorAll('.x6-port-body')
    showPorts(ports, false)
    instance.proxy.$bus.emit('tableConfig', e.node.store.data)
    nodeConfig.value = e.node.store.data
  })
  graph.on('history:change', ({ cmds, options }) => {
    const undoAndRedo = {
      canUndo: graph.canUndo(),
      canRedo: graph.canRedo(),
    }
    instance.proxy.$bus.emit('undoAndRedo', undoAndRedo)
  })

  // 拖动节点的事件
  graph.on('node:mousemove', (e) => {
    saveG6Json()
  })
  // 节点双击事件
  graph.on('node:dblclick', (e) => {
    const models = e.node.store.data
    selectId.value = models.id
    instance.proxy.$bus.emit('aloneNode', models)
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
          ...models,
        })
      }
    } else {
      tabList.value.push({
        key: '1',
        ...models,
      })
    }
    instance.proxy.$bus.emit('tabSourceChangeSvg', models)
    TabsValue.value = tabList.value.length.toString()
  })
  // 边连接
  graph.on('edge:connected', ({ isNew, edge }) => {
    if (isNew) {
      saveG6Json()
    }
  })
  graph.on('blank:click', () => {
    isSelect.value = false
    nodeConfig.value = {}
  })
  graph.on('edge:click', (e) => {
    console.log(e);
    edge.value = e.edge
    isSelect.value = true
    nodeConfig.value = e.edge.store.data
    insertCss(`
      .x6-edge.x6-edge-selected path:nth-child(2) {
        stroke: #1890ff;
      }
    `)
  })
  // graph.on('node:change:size', (e) => {
  //   isSelect.value = true
  //   nodeConfig.value = e.node.store.data
  // })
}

const changeNode = (e) => {
  const { shape, data } = e
  if (shape === 'edge') {
    edge.value.attr({
      line: {
        targetMarker: {
          name:
            data.direction === 'positive' || data.direction === 'bothway'
              ? data.arrowType
              : data.direction === 'reverse'
              ? ''
              : '',
          rx: data.arrowType === 'ellipse' ? 7 : ''
        },
        sourceMarker: {
          name:
            data.direction === 'positive'
              ? ''
              : data.direction === 'reverse' || data.direction === 'bothway'
              ? data.arrowType
              : '',
          rx: data.arrowType === 'ellipse' ? 7 : ''
        },
        strokeDasharray: data.lineShape === 'solid' ? 0 : 5,
        stroke:data.lineColor,
        strokeWidth:data.lineSize
      },
    })
    edge.value.setLabels([
      {
        attrs: {
          label: {
            text: data.label,
            fill: data.lineTextColor,
            fontSize: data.lineFontsize,
          },
        },
      },
    ])
    edge.value.setConnector(data.lineStyle)
  } else {
    nodeItem.value.attr({
      text: {
        text: data.label,
      },
      label: {
        fontSize: data.fontsize,
        fill: data.color,
      },
      body: {
        fill: data.fill,
        stroke: data.stroke,
        rx: data.radio,
        ry: data.radio,
        filter: data.shadow
          ? {
              name: 'highlight',
              args: {
                color: '#252527',
                width: 2,
                blur: 4,
                opacity: 1,
              },
            }
          : {
              name: 'highlight',
              args: {
                color: '#252527',
                width: 0,
                blur: 0,
                opacity: 0,
              },
            },
        strokeWidth:data.nodeStrokeWidth
      },
    })
    nodeItem.value.prop(('position', { x: data.x, y: data.y }))
    nodeItem.value.prop(('size', { width: data.width, height: data.height }))
  }
}
// 保存画布数据
const saveG6Json = () => {
  instance.proxy.$bus.emit('saveData', graph.toJSON())
}

const handlerTabsClick = (tab) => {
  const T = tab.props.name
  tabList.value.forEach((item) => {
    if (item.key === T) {
      selectId.value = item.id
      instance.proxy.$bus.emit('tabSourceChangeSvg', item)
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
          instance.proxy.$bus.emit('tabSourceChangeSvg', nextTab)
          instance.proxy.$bus.emit('aloneNode', nextTab)
        }
      }
    })
  }
  TabsValue.value = activeName
  tabList.value = tabs.filter((tab) => tab.key !== targetName)
  if (tabList.value.length <= 0) {
    graphData.value = {}
    graph.dispose()
    createGraphic()
    initGraphEvent()
  }
}
const minimapDrop = (e) => {
  const dom = document.getElementsByClassName('minimap_dialog')[0]
  let domX = e.clientX - dom.offsetLeft
  let domY = e.clientY - dom.offsetTop
  document.onmousemove = (ev) => {
    minimapPoint.x = ev.clientX - domX
    minimapPoint.y = ev.clientY - domY
  }
  document.onmouseup = () => {
    document.onmousemove = null
    document.onmouseup = null
  }
}
const closeMap = () => {
  minimapMark.value = false
  minimapPoint.x = 1017
  minimapPoint.y = 50
}

onMounted(() => {
  setTimeout(() => {
    createGraphic()
    initGraphEvent()
    loading.value = false
  }, 800)
})
onUnmounted(() => {
  instance.proxy.$bus.all.clear()
})
</script>
<style lang="scss" scoped>
.canvas_item {
  width: 100%;
  height: calc(100% - 225px);
  transition: height 0.2s linear;

  &.out_height {
    height: 100%;
  }
}

.canvas {
  width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  position: relative;
  z-index: 1;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
}

.graph-container {
  width: 100%;
  height: 100% !important;
  flex: 1 1;
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
.minimap_dialog {
  position: absolute;
  left: 87%;
  top: 50px;
  z-index: 99;
  width: 180px;
  height: 180px;
  border-radius: 5px;
  box-shadow: 0px 0px 2px #c0c0c0;

  .mxWindowTitle {
    color: rgb(112, 112, 112);
    background: #f1f3f4;
    padding: 4px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    font-size: 13px;
    height: 22px;
    line-height: 1;
    border-radius: 5px 5px 0 0;
    text-align: center;
    position: relative;
    cursor: move;

    .close {
      position: absolute;
      right: 4px;
      cursor: pointer;
    }
  }

  .minimap {
    height: 158px;
  }
}
</style>
