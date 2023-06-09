<template>
  <!-- 画布区域 -->
  <div
    id="graph"
    class="canvas_box"
    :class="{ out_height: isOut }"
    ref="targetContent"
    v-loading="loading"
    element-loading-text="加载中..."
  >
    <SketchRule
      :thick="state.thick"
      :scale="state.scale"
      :width="containerInfo.width"
      :height="containerInfo.height"
      :start-x="state.startX"
      :start-y="state.startY"
      :isShowReferLine="state.isShowReferLine"
      :lines="state.lines"
      :palette="state.palette"
    >
    </SketchRule>
    <div id="screens" class="screens">
      <div class="screen-container">
        <div id="graph-container" class="graph-container"></div>
      </div>
    </div>
  </div>

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
</template>
<script setup>
import _ from 'lodash'
import { workStore } from '@/store/index'
import { storeToRefs } from 'pinia'
import Cookies from 'js-cookie'
import { randomRbg } from '@/utils/utils'

import { Graph, Shape, Color } from '@antv/x6'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { MiniMap } from '@antv/x6-plugin-minimap'
import insertCss from 'insert-css'

import { SketchRule } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import { CloseBold } from '@element-plus/icons-vue'
import { onBeforeUnmount } from 'vue'

const emit = defineEmits(['handleHistory'])
const instance = getCurrentInstance()
instance.proxy.$bus.on('*', (name, val) => {
  if (name == 'setFlyData') {
    const flight = val.form
    const nodes = graph.getNodes()
    if (val.action == 'add') {
      const node = graph.addNode({
        shape: 'custom-flight-html',
        x: flight.x,
        y: flight.y,
        myTarget: 'flight',
        data: {
          id: flight.id,
          label: flight.title,
          x: flight.x,
          y: flight.y,
          width: flight.width,
          sTime: flight.sTime,
          eTime: flight.eTime,
          color: randomRbg(rbgIndex.value),
        },
      })
      node.prop('size', { width: flight.width, height: node.store.data.size.height })
      rbgIndex.value++
    } else if (val.action == 'update') {
      nodes.map((item) => {
        if (item.store.data.data.id === flight.id) {
          item.prop('position', { x: flight.x, y: item.store.data.position.y })
          item.prop('size', { width: flight.width, height: item.store.data.size.height })
          item.setData({
            label: flight.title,
            x: flight.x,
            y: item.store.data.position.y,
            width: flight.width,
            height: item.store.data.size.height,
            sTime: flight.sTime,
            eTime: flight.eTime,
          })
        }
      })
    } else if (val.action == 'remove') {
      const removeNode = nodes.filter((item) => {
        return item.store.data.data.id === flight.id
      })
      graph.removeCells(removeNode)
    }
  }
  if (name === 'changeCell') {
    console.log(val)
    const store = val.store.data.data
    val.prop('position', { x: store.x, y: store.y })
    val.prop('size', { width: store.width, height: val.store.data.size.height })
    val.setData({
      label: store.taskName,
      x: store.x,
      width: store.width,
      height: val.store.data.size.height,
      langTime: store.langTime,
      desc: store.desc,
      prec: store.prec,
      startTime: store.startTime,
      endTime: store.endTime,
      needList: store.needList,
      taskName: store.taskName,
      funName: store.funName,
    })
  }
  if (name == 'sendOut') {
    isOut.value = val
    parentSize()
  }
  if (name == 'resize' || name == 'hideMenu') {
    parentSize()
  }
})

const work = workStore()
const { dragEv } = storeToRefs(work)

const dragItem = ref(null) // 当前拖动元素信息
const targetContent = ref(null)

const slideFade = ref(false)
const isOut = ref(false)
const rbgIndex = ref(0)

let graph = null
const graphData = ref({})
// 标尺配置
const state = reactive({
  scale: 1,
  startX: 0,
  lines: {},
  thick: 20,
  isShowRuler: true, // 显示标尺
  isShowReferLine: false, // 显示参考线
  palette: {
    bgColor: '#181b24',
    longfgColor: '#BABBBC',
    shortfgColor: '#9C9C9C',
    fontColor: '#DEDEDE',
    shadowColor: '#525252',
    lineColor: '#EB5648',
    borderColor: '#B5B5B5',
    cornerActiveColor: '#fff',
  },
})
// 标尺长度宽度
const containerInfo = reactive({
  width: 0,
  height: 0,
})

const loading = ref(true)
const minimapPoint = reactive({
  x: '',
  y: '',
})
// 小地图开关
const minimapMark = ref(false)

watch(dragEv, (n) => {
  if (n !== null) {
    dragstart(n)
  }
})
// 拖拽元素开始
const dragstart = (item) => {
  dragItem.value = item
  // 元素行为 移动
  targetContent.value.addEventListener('dragenter', dragenter)
  // 目标元素经过 禁止默认事件
  targetContent.value.addEventListener('dragover', dragover)
  // 离开目标元素设置元素的放置行为  不能拖放
  targetContent.value.addEventListener('dragleave', dragleave)
  // 拖动元素在目标元素松手时添加元素到画布
  targetContent.value.addEventListener('drop', drop)
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
const drop = (e) => {
  const point = graph.clientToLocal(e.clientX, e.clientY)
  graph.addNode({
    shape: 'custom-html',
    x: point.x - 50,
    y: point.y - 20,
    data: {
      label: dragItem.value.label,
      x: point.x - 50,
      y: point.y - 20,
      color: dragItem.value.bgColor,
      width: 100,
      langTime: '',
      desc: '',
      prec: '',
      startTime: '',
      endTime: '',
      needList: [],
      taskName: dragItem.value.label,
      funName: '',
    },
  })
  instance.proxy.$bus.emit('taskRelationship', graph.getNodes())
  targetContent.value.removeEventListener('dragenter', dragenter)
  targetContent.value.removeEventListener('dragover', dragover)
  targetContent.value.removeEventListener('dragleave', dragleave)
  targetContent.value.removeEventListener('drop', drop)
}

// 初始化创建画布
const createGraphic = () => {
  // 定义html节点
  Shape.HTML.register({
    shape: 'custom-html',
    width: 100,
    height: 40,
    effect: ['data'],
    html(cell) {
      const { color, width, x, label } = cell.getData()
      const div = document.createElement('div')
      div.className = 'custom-html'
      div.style.background = color
      div.style.width = width + 'px'
      div.innerHTML = `
        <span>${label}</span>
        <div class='tool-tip'>
          ${x >= 0 ? Math.abs(x.toFixed(0)) : x.toFixed(0)},
          ${x + width >= 0 ? Math.abs((x + width).toFixed(0)) : (x + width).toFixed(0)}
        </div>`
      return div
    },
  })
  // 定义飞行段html节点
  Shape.HTML.register({
    shape: 'custom-flight-html',
    width: 100,
    height: 40,
    effect: ['data'],
    html(cell) {
      const { color, width, x, label } = cell.getData()
      const div = document.createElement('div')
      div.className = 'custom-flight-html'
      div.style.background = `linear-gradient(135deg, transparent 18px, ${color} 0)`
      div.style.width = width + 'px'
      div.innerHTML = `
        <span>${label}</span>
        <div class='tool-tip'>
          ${x>=0 ? Math.abs(x.toFixed(0)) : x.toFixed(0)},
          ${(x + width) >= 0 ? Math.abs((x + width).toFixed(0)) : (x + width).toFixed(0)}
        </div>`
      return div
    },
  })
  const graphDom = document.getElementById('graph-container')
  graph = new Graph({
    container: graphDom,
    width: containerInfo.width,
    height: containerInfo.height,
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
    // mousewheel: {
    //   enabled: true,
    //   modifiers: ['ctrl', 'meta'],
    // },
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
  graph.bindKey(['meta+shift+z', 'ctrl+y'], () => {
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
    .custom-html {
      width: 100%;
      height: 100%;
      box-shadow: 0 0.125em 0.3125em rgb(0 0 0 / 25%),
        0 0.02125em 0.06125em rgb(0 0 0 / 25%);
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      position: relative;
      &:hover {
        .tool-tip{
          visibility: visible;
        }
      }
    }
    .tool-tip{
      width: 70px;
      height: 23px;
      background: #fff;
      border-radius: 7px;
      position: absolute;
      bottom: -33px;
      z-index: 99;
      border: 1px solid #ccc;
      display: flex;
      justify-content: center;
      font-size: 13px;
      align-items: center;
      visibility: hidden;
    }
    .custom-flight-html{
      width: 100%;
      height: 100%;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      position: relative;
      &:hover {
        .tool-tip{
          visibility: visible;
        }
      }
    }
  `)

  if (Object.keys(graphData.value).length) {
    graph.fromJSON(graphData.value.cells)
    graph.centerContent()
    // 画布移动到中心标尺跟随变动
    const translate = graph.translate()
    const startX = -(translate.tx / state.scale)
    state.startX = startX
  }
}
// 初始化图事件
const initGraphEvent = () => {
  graph.on('history:change', ({ cmds, options }) => {
    emit('handleHistory', {
      canUndo: graph.canUndo(),
      canRedo: graph.canRedo(),
    })
  })
  graph.on('translate', ({ tx, ty }) => {
    // 标尺开始的刻度  这里的 ‘-’ 不加的话标尺会反方向滚动
    const startX = -(tx / state.scale)
    state.startX = startX
  })
  graph.on('node:click', (e) => {
    if (!e.cell.store.data.myTarget) {
      changeNodeData({}, e)
    }
  })
  graph.on('node:moving', (e) => {
    const dom = e.cell
    changeNodeData(dom, e)
  })
  graph.on('node:change:size', (e) => {
    const dom = e.cell
    changeNodeData(dom, e)
  })
  graph.on('node:mouseenter', (e) => {
    e.cell.toFront()
  })
}
// 更新 属性
function changeNodeData(dom, e) {
  if (Object.keys(dom).length) {
    dom.updateData({
      x: e.node.store.data.position.x,
      y: e.node.store.data.position.y,
      width: e.node.store.data.size.width,
    })
  }
  if (!e.cell.store.data.myTarget) {
    e.cell.store.data.data.startTime = e.cell.store.data.data.x.toFixed(0) + 's'
    e.cell.store.data.data.endTime = (e.cell.store.data.data.x + e.cell.store.data.size.width).toFixed(0) + 's'
    instance.proxy.$bus.emit('showCellData', e.cell)
  } else {
    instance.proxy.$bus.emit('flightChange', e.cell)
  }
}
const hideMenu = (val) => {
  slideFade.value = val
  parentSize()
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
// 获取任务详情
const getDetail = () => {
  return new Promise((resolve, reject) => {
    instance.proxy.$axios.getTaskDetail({ taskId: 2001 }).then((res) => {
      if (res.success && res.data !== null) {
        const data = JSON.parse(res.data.daTree)
        graphData.value = data
        const flight = graphData.value.cells.filter(item=>{
          return item.shape === 'custom-flight-html'
        })
        console.log(flight);
        instance.proxy.$bus.emit('sendFlight',flight)
        resolve('success')
      }
    })
  })
}

// 重新计算画布宽高，限制元素边界
function parentSize() {
  setTimeout(() => {
    containerInfo.width = targetContent.value.clientWidth
    containerInfo.height = targetContent.value.clientHeight
  }, 300)
}

const saveTaskDetail = () => {
  // 单独保存画布数据
  instance.proxy.$axios
    .saveTaskDetail({
      taskId: 2001,
      daTree: JSON.stringify(graph.toJSON()),
    })
    .then((res) => {
      console.log(res, 'save应用架构任务')
    })
  // TODO: 保存全部的数据 暂时搁置   通过storage
}

const handleToolMenu = (target, val) => {
  if (val === '缩略图') {
    minimapMark.value = true
  }
  if (val === '格式') {
    hideMenu(target)
  }
  if (val === '撤销') {
    if (graph.canUndo()) {
      graph.undo()
    }
  }
  if (val === '重做') {
    if (graph.canRedo()) {
      graph.redo()
    }
  }
}
defineExpose({ saveTaskDetail, handleToolMenu })

onMounted(() => {
  getDetail().then(
    (res) => {
      if (res === 'success') {
        createGraphic()
        initGraphEvent()
        loading.value = false
        // 给任务关系定义发送数据
        instance.proxy.$bus.emit('taskRelationship', graph.getNodes())
        instance.proxy.$bus.emit('sendMessage', graph.getNodes())
      }
    },
    (err) => {
      createGraphic()
      initGraphEvent()
      loading.value = false
    }
  )
  const parentDom = document.getElementById('graph')
  containerInfo.width = parentDom.clientWidth
  containerInfo.height = parentDom.clientHeight
  window.addEventListener('resize', () => {
    parentSize()
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {parentSize()})
  instance.proxy.$bus.all.clear()
})
</script>
<style lang="scss" scoped>
.canvas_box {
  flex: 1;
  height: 100%;
  width: calc(100% - 200px);
  background: #fff;
  position: relative;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: height 0.2s ease-in-out;

  &.out_height {
    height: 100%;
  }
}

.graph-container {
  width: 100%;
  height: 100% !important;
  flex: 1 1;
}

.screens {
  position: absolute;
  width: 100%;
  height: 100%;
}

.screen-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
}
.minimap_dialog {
  position: absolute;
  left: 1017px;
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

/* rules style */
:deep(.v-container) {
  display: none;
}

:deep(.corner) {
  display: none;
}

:deep(.h-container) {
  left: 0 !important;
  bottom: 0;
  top: auto;
  width: 100% !important;
}
</style>
