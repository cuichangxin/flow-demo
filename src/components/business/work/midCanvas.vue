<template>
  <!-- 画布区域 -->
  <div id="graph" class="canvas_box" :class="{ out_height: isOut }" ref="targetContent">
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

  <el-aside class="el-aside-menu" :class="{ fade: slideFade, out_height: isOut }">
    <h4 v-if="!slideFade">
      <i class="iconfont icon">&#xe622;</i>
      应用任务模型
    </h4>
    <el-scrollbar class="scrollbar">
      <el-menu :default-openeds="['1']" class="menu-info">
        <modelMenu :moduleTree="moduleTree"></modelMenu>
      </el-menu>
    </el-scrollbar>
    <markPoint :isOut="slideFade" :direction="'left'" :color="'#fff'" @hideMenu="hideMenu"></markPoint>
  </el-aside>
</template>
<script setup>
import modelMenu from './modelMenu.vue'
import _ from 'lodash'
import { workStore } from '@/store/index'
import { storeToRefs } from 'pinia'
import Cookies from 'js-cookie'
import markPoint from '../../common/mark/markPoiner.vue'

import { Graph, Shape } from '@antv/x6'
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
import { reactive, watch } from 'vue'

const instance = getCurrentInstance()
// instance.proxy.$bus.on('*', (name, val) => {
//   if (name == 'setFlyData') {
//     banResize.value = true
//     showScale.value = true
//     const copy = _.cloneDeep(val)
//     const lineEl = line.value
//     nextTick(() => {
//       if (copy.action == 'add') {
//         console.log(lineEl)
//         copy.form.top = lineEl.offsetTop - 80
//         flyList.value.push(copy.form)
//       } else if (copy.action == 'update') {
//         flyList.value.forEach((vals) => {
//           if (vals.title == copy.form.oldTitle) {
//             nextTick(() => {
//               vals.left = copy.form.left
//               nextTick(() => {
//                 vals.w = copy.form.w
//               })
//             })
//             vals.sTime = copy.form.sTime
//             vals.eTime = copy.form.eTime
//             vals.title = copy.form.title
//             vals.top = lineEl.offsetTop - 80
//             vals.oldTitle = copy.form.oldTitle
//           }
//         })
//       } else if (copy.action == 'remove') {
//         flyList.value.forEach((d, i) => {
//           if (d.title == copy.form.oldTitle) {
//             flyList.value.splice(i, 1)
//           }
//         })
//       }
//       // save()
//     })
//   }
//   if (name == 'sendOut') {
//     isOut.value = val
//     parentSize()
//   }
//   if (name == 'hideMenu') {
//     parentSize()
//   }
// })

const work = workStore()
const { taskPropertyData, dragEv } = storeToRefs(work)
const moduleTree = ref([
  {
    id: '1',
    label: '业务模型库',
    isDrag: false,
    hide: false,
    children: [
      {
        id: '1-1',
        label: '综合控制任务',
        isDrag: true,
        bgColor: '#f8ebdc',
        control: false,
        shape: 'custom-html',
      },
      {
        id: '1-2',
        label: '遥测任务',
        isDrag: true,
        bgColor: '#e8f6dc',
        control: false,
        shape: 'custom-html',
      },
      {
        id: '1-3',
        label: '遥控任务',
        isDrag: true,
        bgColor: '#e0f4f5',
        control: false,
        shape: 'custom-html',
      },
      {
        id: '1-4',
        label: '数据采集任务',
        isDrag: true,
        bgColor: '#fff',
        control: false,
        shape: 'custom-html',
      },
      {
        id: '1-5',
        label: '姿控任务',
        isDrag: true,
        bgColor: '#f5deec',
        control: false,
        shape: 'custom-html',
      },
      {
        id: '1-6',
        label: '制导任务',
        isDrag: true,
        bgColor: '#e8ebed',
        control: false,
        shape: 'custom-html',
      },
    ],
  },
  {
    id: '2',
    label: '基础模型库',
    isDrag: false,
    hide: false,
    children: [
      {
        id: '2-1',
        label: '通用任务',
        isDrag: true,
        shape: 'custom-html',
      },
    ],
  },
])
const dragItem = ref(null) // 当前拖动元素信息
const targetContent = ref(null)

const slideFade = ref(false)
const isOut = ref(false)

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
const containerInfo = reactive({
  width: 0,
  height: 0,
})
const pointCoordinate = reactive({
  start:0,
  end:0
})

// watchEffect(() => {
//   if (dragList.value.length) {
//     showScale.value = true
//     banResize.value = true
//     nextTick(() => {
//       lineOffsetLeft.value = line.value.offsetLeft
//       dragList.value.forEach((item) => {
//         const dottedEl = document.getElementsByClassName(`task_${item.id}`)[0]
//         const h = line.value.offsetTop - dottedEl.offsetTop
//         item.dottedH = h
//         item.endTime = item.w + (item.left - lineOffsetLeft.value - 100) + 's'
//       })
//       banResize.value = false
//       // save()
//     })
//   }
//   instance.proxy.$bus.emit('sendMessage', dragList.value)
// })
// watch(
//   [taskPropertyData, dragEv],
//   ([t, drag], [ot]) => {
//     if (drag !== null) {
//       dragstart(drag)
//     }
//     if (JSON.stringify(t) !== JSON.stringify(ot)) {
//       banResize.value = true
//       dragList.value.forEach((item) => {
//         if (item.label == t.label) {
//           nextTick(() => {
//             item.left = t.left
//             nextTick(() => {
//               item.w = t.w
//             })
//           })
//           item.desc = t.desc
//           item.endTime = t.endTime
//           item.langTime = t.langTime
//           item.prec = t.prec
//           item.startTime = t.startTime
//           item.needList = t.needList
//         }
//       })
//       // setTimeout(() => {
//       //   save()
//       // }, 100)
//     }
//     setTimeout(() => {
//       banResize.value = false
//     }, 2000)
//   },
//   { deep: true }
// )
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
  graph.addNode({
    shape: 'custom-html',
    x: e.layerX,
    y: e.layerY,
    label: dragItem.value.label,
    attrs: {
      body: {
        fill: dragItem.value.bgColor,
      },
    },
  })
  targetContent.value.removeEventListener('dragenter', dragenter)
  targetContent.value.removeEventListener('dragover', dragover)
  targetContent.value.removeEventListener('dragleave', dragleave)
  targetContent.value.removeEventListener('drop', drop)
  // save()
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
      console.log(cell);
      pointCoordinate.start = cell.store.data.position.x
      pointCoordinate.end = cell.store.data.position.x + cell.store.data.size.width
      const div = document.createElement('div')
      div.className = 'custom-html'
      div.innerText = cell.store.data.label
      div.innerHTML = `
        <span>${cell.store.data.label}</span>
        <div class='tool-tip'>
          ${pointCoordinate.start},
          ${pointCoordinate.end}
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
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
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
  // .use(
  //   new MiniMap({
  //     container: document.getElementById('minimap'),
  //     width: document.getElementById('minimap').clientWidth,
  //     height: document.getElementById('minimap').clientHeight,
  //   })
  // )

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
      border: 1px solid #ccc;
      display: flex;
      justify-content: center;
      font-size: 13px;
      align-items: center;
      visibility: hidden;
    }
  `)

  if (Object.keys(graphData.value).length) {
    graph.fromJSON(graphData.value.cells)
    graph.centerContent()
  }
}
// 初始化图事件
const initGraphEvent = () => {
  graph.on('history:change', ({ cmds, options }) => {
    // canUndo.value = graph.canUndo()
    // canRedo.value = graph.canRedo()
  })
  graph.on('translate', ({ tx, ty }) => {
    // 标尺开始的刻度  这里的 ‘-’ 不加的话标尺会反方向滚动
    const startX = -(tx / state.scale)
    state.startX = startX
  })
  graph.on('node:mouseenter', (e) => {
    
  })
  graph.on('node:mouseleave', (e) => {
    
  })
  graph.on('node:click', (e) => {
    console.log(e);
  })
  graph.on('node:moving', (e) => {
    console.log(e);
    pointCoordinate.start = e.node.store.data.position.x
    pointCoordinate.end = e.node.store.data.position.x + e.node.store.data.size.width
  })
}

const hideMenu = (val) => {
  slideFade.value = val
  parentSize()
}
// 获取任务详情
const getDetail = () => {
  instance.proxy.$axios.getTaskDetail({ taskId: 2001 }).then((res) => {
    console.log(res)
    if (res.success && res.data !== null) {
      const data = JSON.parse(res.data.daTree)
      dragList.value = data.dragData
      flyList.value = data.flyData
      work.taskListStore = data.dragData
    } else {
      let workData = localStorage.getItem('workData')
      if (workData) {
        dragList.value = JSON.parse(workData).dragData
        flyList.value = JSON.parse(workData).flyData
        work.taskListStore = JSON.parse(workData).dragData
      }
    }
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
      daTree: JSON.stringify({
        dragData: dragList.value,
        flyData: flyList.value,
      }),
    })
    .then((res) => {
      console.log(res, '应用架构任务')
    })
  // TODO: 保存全部的数据 暂时搁置
}

defineExpose({ saveTaskDetail })

onMounted(() => {
  // getDetail()

  // work.setScaleLineData(line.value)

  // const length = Math.floor(targetContent.value.offsetWidth / 100)
  // let count = 0
  // for (var i = 0; i < length - 2; i++) {
  //   scaleList.value.push({
  //     num: (count += 100),
  //   })
  // }
  const parentDom = document.getElementById('graph')
  containerInfo.width = parentDom.clientWidth
  containerInfo.height = parentDom.clientHeight
  createGraphic()
  initGraphEvent()
  // instance.proxy.$bus.emit('sendMessage', dragList.value)
})
// TODO:  标尺 跟随 浏览器窗口大小以及菜单隐藏还未响应
</script>
<style lang="scss" scoped>
.canvas_box {
  flex: 1;
  height: calc(100% - 236px);
  width: calc(100% - 200px);
  background: #fff;
  margin-right: 20px;
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

.el-aside-menu {
  height: calc(100% - 236px);
  max-width: 200px;
  margin-bottom: 0;
  padding: 0;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: visible;
  transition: width 0.3s ease-in-out, height 0.2s ease-in-out;

  h4 {
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e8ea;
    text-align: center;
    margin-bottom: 0;
    white-space: nowrap;

    .icon {
      margin-right: 8px;
    }
  }

  .icons {
    display: inline-block;
    width: 100%;
    text-align: center;
  }

  .scrollbar {
    height: calc(100% - 60px);
  }

  &.fade {
    width: 0;
  }
  &.out_height {
    height: 100%;
  }

  &:hover {
    .click {
      opacity: 1;
    }
  }
}

.menu-info {
  width: 100%;
  display: inline-block;
  border-right: none;
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
