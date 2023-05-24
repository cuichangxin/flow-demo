<template>
  <shapeHeader></shapeHeader>
  <div class="test-info" :style="{ height: `${mainH}px` }">
    <el-container class="el-container-layout">
      <el-aside class="el-aside el-aside-left" :class="{ 'fade': isOut }">
        <h4 v-if="!isOut" class="title">仿真组件库</h4>
        <el-scrollbar class="el-scrollbar-info" :style="{ padding: isOut ? 0 : '0 10px' }">
          <el-menu @open="open" @close="close" id="elMenu" :collapse="isOut">
            <testElMenu :menus="menuList" :drag="true" :openFlag="openFlag"></testElMenu>
          </el-menu>
        </el-scrollbar>
        <div class="click" @click="out"></div>
      </el-aside>
      <el-container class="layout-wrapper">
        <el-main class="canvas-wrapper" :style="{ paddingBottom: isOutB ? '0' : '' }">
          <div style="width:100%; min-width: 0;">
            <h4 class="title">仿真测试环境</h4>
            <!-- canvas容器 -->
            <div id="graph" class="container" ref="graphRef">
              <div id="graph-container" class="graph-container"></div>
            </div>
          </div>
          <el-aside class="el-aside el-aside-right" id="asideRef" :class="{ 'fade_r': isOutR }">
            <h4 class="aside-title">属性栏</h4>
            <tableBar :tableList="tableList" :domH="domH" @saveTable="saveTable"></tableBar>
            <div class="right_out" @click="outR"></div>
          </el-aside>
        </el-main>
        <el-footer class="el-footer" :class="{ 'fade': isOutB }">
          <el-space :size="20" class="icon-info" :class="{ 'op': isOutB }">
            <i class="iconfont icon icon-fangdajing"></i>
            <i class="iconfont icon icon-shezhi"></i>
            <i class="iconfont icon icon-shuaxin"></i>
            <i class="iconfont icon icon-yunhang"></i>
          </el-space>
          <div class="terminal" v-if="!isOutB">
            <el-radio-group v-model="radio" class="button-group">
              <el-radio-button label="控制台" />
              <el-radio-button label="输出问题" />
            </el-radio-group>
            <div class="terminal-item"></div>
          </div>
          <div class="out" :class="{ 'h': isOutB }" @click="outB"></div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
  <nodeConfigDrawer :drawerHidden="drawerHidden" :config="config" @closes="closesD" @updateNode="updateNode">
  </nodeConfigDrawer>
</template>
<script setup>
import tableBar from '@/components/business/tableBar.vue';
import testElMenu from '@/components/business/testElMenu.vue';
import nodeConfigDrawer from '@/components/common/nodeConfigDrawer.vue'
import shapeHeader from '@/components/common/shapeHeader.vue'
import G6 from '@antv/g6'
import registerFactory from 'welabx-g6'
import insertCss from 'insert-css'
import { getImgSize, fittingString } from '../utils/utils'
import _ from 'lodash'

import { Graph, Shape } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { nextTick } from 'vue';

const instance = getCurrentInstance()
instance.proxy.$bus.on('resize', (val) => {
  size()
  if (val !== undefined && !val) {
    mainH.value = mainH.value - 60
  } else if (val !== undefined && val) {
    mainH.value = mainH.value + 60
  }
})
const radio = ref('控制台')
let graph = null
const graphRef = ref(null)
const graphData = ref({
  nodes: [],
  edges: []
})
let menuList = reactive([
  {
    id: '1',
    label: '动力学',
    drag: false,
    children: [
      {
        id: '1-1',
        label: '姿态动力学',
        drag: true,
        shape: 'image',
        img: new URL('/src/assets/image/1553b.png', import.meta.url).href,
        list: [
          {
            key: '处理器',
            value: ''
          },
          {
            key: '频率',
            value: ''
          },
          {
            key: '内存',
            value: ''
          }
        ],
      },
      {
        id: '1-2',
        label: '环境扰动力/力矩模型',
        drag: true,
        shape: 'circle-node',
        fill: '#61c0bf'
      },
      {
        id: '1-3',
        label: '数值积分轨道动力学',
        drag: true,
        shape: 'ellipse-node',
        fill: '#00adb5'
      },
      {
        id: '1-4',
        label: '空间环境磁场',
        drag: true,
        shape: 'diamond-node',
        fill: '#ea5455'
      },
      {
        id: '1-5',
        label: '19根数外推轨道动力学',
        drag: true,
        fill: '#07689f'
      },
    ]
  },
  {
    id: '2',
    label: '敏感器',
    drag: false,
    children: [
      {
        id: '2-1',
        label: '单轴模拟太阳敏感器组',
        drag: true,
      },
      {
        id: '2-2',
        label: '双轴模拟太阳敏感器组',
        drag: true,
      },
      {
        id: '2-3',
        label: '加速度计',
        drag: true,
        shape: 'image',
        img: new URL('../assets/image/jielian.png', import.meta.url).href
      },
      {
        id: '2-4',
        label: '数字太敏组',
        drag: true,
      },
      {
        id: '2-5',
        label: '差分GPS模型',
        drag: true,
      },
      {
        id: '2-6',
        label: 'GNSS模型',
        drag: true,
      },
      {
        id: '2-7',
        label: '陀螺组模型',
        drag: true,
        shape: 'image',
        img: new URL('../assets/image/tuoluo.jpg', import.meta.url).href
      },
      {
        id: '2-8',
        label: '圆锥扫描红外',
        drag: true,
        shape: 'image',
        img: new URL('../assets/image/gps.png', import.meta.url).href
      },
      {
        id: '2-9',
        label: '摆动式红外组',
        drag: true,
        shape: 'image',
        img: new URL('../assets/image/jisuanji.png', import.meta.url).href
      },
      {
        id: '2-10',
        label: '0-1太阳敏感器组',
        drag: true,
      },
      {
        id: '2-11',
        label: '光学相机模型V1.0',
        drag: true,
      },
    ]
  },
  {
    id: '3',
    label: '时序模型',
    drag: false,
    children: [
      {
        id: '3-1',
        label: '时序模型',
        drag: true,
        shape: 'image',
        img: new URL('../assets/image/shixu.png', import.meta.url).href
      },
    ]
  },
  {
    id: '4',
    label: '火箭箭机模型',
    drag: false,
    children: [
      {
        id: '4-1',
        label: 'C7Y1箭机模型',
        drag: true,
        shape: 'image',
        img: new URL('../assets/image/UART.png', import.meta.url).href
      },
      {
        id: '4-2',
        label: 'C7Y2箭机模型',
        drag: true,
      },
      {
        id: '4-3',
        label: 'C7Y3箭机模型',
        drag: true,
      },
    ]
  },
  {
    id: '5',
    label: '伺服机构模型',
    drag: false,
    children: [
      {
        id: '5-1',
        label: 'C7伺服模型',
        drag: true,
      },
      {
        id: '5-2',
        label: 'C8伺服模型',
        drag: true,
      },
    ]
  },
  {
    id: '6',
    label: '重力模型',
    drag: false,
    children: [
      {
        id: '6-1',
        label: '重力模型',
        drag: true,
      },
    ]
  },
  {
    id: '7',
    label: '主发动机模型',
    drag: false,
    children: [
      {
        id: '7-1',
        label: 'C7发动机模型',
        drag: true,
      },
      {
        id: '7-2',
        label: 'C8发动机模型',
        drag: true,
      },
    ]
  },
  {
    id: '8',
    label: '接口',
    drag: false,
    children: [
      {
        id: '8-1',
        label: 'RS485接口',
        drag: true,
      },
      {
        id: '8-2',
        label: 'RS422接口',
        drag: true,
      },
      {
        id: '8-3',
        label: '1553B总线接口',
        drag: true,
      },
      {
        id: '8-4',
        label: 'CAN接口',
        drag: true,
      },
      {
        id: '8-5',
        label: '网口接口',
        drag: true,
      },
      {
        id: '8-6',
        label: '光纤接口',
        drag: true,
      },
    ]
  },
])
const openFlag = ref({})
const tableList = ref([])
const domH = ref(0)
const mainH = ref('')
const isOut = ref(false)
const isOutR = ref(false)
const isOutB = ref(false)
const drawerHidden = ref(false)
const config = ref({})
const atItem = ref({})

const open = (index) => {
  openFlag.value = {
    index,
    flag: true
  }
}
const close = (index) => {
  openFlag.value = {
    index,
    flag: false
  }
}

const closesD = (val) => {
  drawerHidden.value = val
}

function getImgUrl(img) {
  return new URL(`../assets/image/${img}`, import.meta.url).href
}
const createGraphic = () => {
  const parentDom = document.getElementById('graph')
  const graphDom = document.getElementById('graph-container')
  console.log(parentDom.clientHeight);
  const cfg = {
    container: graphDom,
    width: parentDom.clientWidth,
    height: parentDom.clientHeight,
    grid: true,
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 3,
    },
    connecting: {
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: {
          radius: 8,
        },
      },
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
              stroke: '#A2B1C3',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8,
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
  }
  graph = new Graph(cfg)
  console.log(graph);
}
// 初始化图事件
const initGraphEvent = () => {
  // 拖动菜单项节点进入画布
  graph.on("graph:mouseenter", (e) => {

    const { originalEvent } = e
    if (originalEvent.dataTransfer) {
      const transferData = originalEvent.dataTransfer.getData("dragComponent");
      if (transferData) {
        addNode(transferData, e);
        setTimeout(() => {
          saveG6Json()
        }, 100)
      }
    }
  })
}
// 添加节点
const addNode = (transferData, e) => {
  const { img } = JSON.parse(transferData);
  if (img) {
    getImgSize(img).then((res) => {
      formatAddNode(transferData, e, { w: res.width, h: res.height })
    })
  } else {
    formatAddNode(transferData, e, { w: 0, h: 0 })
  }
}
const formatAddNode = (transferData, { x, y }, { w, h }) => {
  const { label, shape, fill, id, img, list } = JSON.parse(transferData);
  const globalFontSize = 12
  const mw = img ? 0 : 80
  const diagonal = Math.sqrt(w * w + h * h)
  let feed = ''
  if (img) {
    for (let i = 0; i < (Math.round(h / 12)); i++) {
      feed += '\n'
    }
  }
  const model = {
    label: feed + fittingString(label, mw, globalFontSize),
    id: id + Date.now(),
    type: shape == "image" ? "" : shape,
    style: {
      fill: shape == "image" ? '' : fill || "#ecf3ff",
      radius: shape == "image" ? 0 : 5,
      width: shape == "image" ? w : shape == 'diamond-node' ? '' : shape == 'ellipse-node' ? '' : shape == 'triangle-node' ? '' : 100,
      height: shape == "image" ? h : shape == 'diamond-node' ? '' : shape == 'ellipse-node' ? '' : shape == 'triangle-node' ? '' : 50,
      lineWidth: shape == "image" ? 0 : 2,
      size: shape == 'diamond-node' ? [100, 100] : '',
      rx: shape == 'ellipse-node' ? 100 : '',
      ry: shape == 'ellipse-node' ? 30 : ''
    },
    labelCfg: {
      style: {
        textBaseLine: 'top'
      }
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
    // 锚点集合
    anchorPoints: shape == 'image' && diagonal <= 125 ? [
      // [0, 0],
      [0.2, 0],
      [0.5, 0],
      [0.8, 0],
      [0, 0.2],
      [0, 0.5],
      [0, 0.8],
      // [0, 1],
      [0.2, 1],
      [0.5, 1],
      [0.8, 1],
      // [1, 0],
      [1, 0.2],
      [1, 0.5],
      [1, 0.8],
      // [1, 1],
    ] : shape == 'image' && diagonal >= 125 ? [
      // [0, 0],
      [0.2, 0],
      [0.3, 0],
      [0.4, 0],
      [0.5, 0],
      [0.6, 0],
      [0.7, 0],
      [0.8, 0],
      [0, 0.2],
      [0, 0.3],
      [0, 0.4],
      [0, 0.5],
      [0, 0.6],
      [0, 0.7],
      [0, 0.8],
      // [0, 1],
      [0.2, 1],
      [0.3, 1],
      [0.4, 1],
      [0.5, 1],
      [0.6, 1],
      [0.7, 1],
      [0.8, 1],
      // [1, 0],
      [1, 0.2],
      [1, 0.3],
      [1, 0.4],
      [1, 0.5],
      [1, 0.6],
      [1, 0.7],
      [1, 0.8],
      // [1, 1],
    ] : [
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ],
    list: JSON.parse(list)
  }
  graph.addItem('node', model)
}
// 保存数据
const saveG6Json = () => {
  localStorage.setItem('g6Data', JSON.stringify(graph.save()))
}
// 画布自适应
const g6Size = () => {
  window.addEventListener("resize", () => {
    size()
  });
}
const saveTable = (data) => {
  saveG6Json()
}
const out = () => {
  isOut.value = !isOut.value
  size()
}
const outR = () => {
  isOutR.value = !isOutR.value
  size()
}
const outB = () => {
  isOutB.value = !isOutB.value
  size()
  setTimeout(() => {
    tableSize()
  }, 300)
}
const editCss = (item) => {
  // console.log(item);
  drawerHidden.value = true
  const model = item.get('model')
  config.value = model
  atItem.value = item
}
const updateNode = (model) => {
  graph.updateItem(atItem.value, model)
  graphData.value = graph.save()

  const anchor = atItem.value.getAnchorPoints()
  console.log(anchor);
  graph.changeData(graphData.value, false)
  const stack = _.cloneDeep(graph.getStackData())
  const redos = [...stack.redoStack].reverse()
  const undos = [...stack.undoStack].reverse()

  // graph.destroy()
  // createGraphic()
  // initGraphEvent()
  saveG6Json()
  const item = graph.find('node', (node) => {
    return node.get('model').id === config.value.id
  })
  config.value = item.get('model')
  atItem.value = item
  // if (redos.length) {
  //   redos.forEach((redo,index) => {
  //     console.log(redo);
  //     graph.pushStack(redo.action, _.cloneDeep(redo.data), 'redo')
  //   })
  // }
  // if (undos.length) {
  //   undos.forEach((undo,index) => {
  //     // if (index === undos.length-1) {
  //     //   console.log(undo.data.after.nodes[0]);
  //     //   undo.data.after.nodes[0].style = {
  //     //     width:'',
  //     //     height:''
  //     //   }
  //     //   undo.data.after.nodes[0].style.width = config.value.style.width
  //     //   undo.data.after.nodes[0].style.height = config.value.style.height
  //     // }
  //     graph.pushStack(undo.action, _.cloneDeep(undo.data), 'undo')
  //     console.log(undo);
  //   })
  // }
}

function size() {
  setTimeout(() => {
    const h = graphRef.value.clientHeight;
    const w = graphRef.value.clientWidth;
    graph.changeSize(w, h);
    //  画布移动到中心
    graph.fitCenter();
  }, 300)
}
onMounted(() => {
  const localList = localStorage.getItem('g6Data')
  if (localList !== null) {
    graphData.value = JSON.parse(localList)
  }
  setTimeout(()=>{
    createGraphic()
  initGraphEvent()
  },200)
  const nodes = [...document.getElementById('elMenu').querySelectorAll('.menu-icon')]
  nodes.forEach(node => {
    node.addEventListener('dragstart', (event) => {
      const label = node.getAttribute('data-label')
      const id = node.getAttribute("data-id");
      const img = node.getAttribute("data-img");
      const shape = node.getAttribute("data-shape");
      const fill = node.getAttribute('data-fill')
      const list = node.getAttribute('data-list')
      event.dataTransfer.setData('dragComponent', JSON.stringify({ label, id, img, shape, fill, list }))
    })
  })
  // 阻止默认事件
  document.addEventListener('drop', e => {
    e.preventDefault()
  }, false)
  tableSize()
})

function tableSize() {
  // 监听右侧菜单的高度动态设置表格的流体高度
  const dom = document.getElementById('asideRef')
  domH.value = dom.clientHeight
  mainH.value = window.innerHeight - 138
  window.onresize = () => {
    domH.value = dom.clientHeight
    mainH.value = window.innerHeight - 138
  }
}

onUnmounted(() => {
  // graph.destroy()
  window.onresize = null
  window.removeEventListener('resize', () => { })
})
</script>

<style lang="scss" scoped>
.test-info {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f0f0f4;
  transition: height .2s linear;
}

.el-container-layout {
  width: 100%;
  height: 100%;
}

.el-aside {
  width: 220px;
  margin-bottom: 0;
  border-radius: 20px;
  padding: 0;
  background-color: #fff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
}

.el-aside-right {
  height: 100%;
  margin-left: 20px;
  border-radius: 20px;
  overflow: visible;
  position: relative;
  z-index: 10;
  transition: width .2s linear;

  .aside-title {
    border-radius: 20px 20px 0 0;
  }

  .right_out {
    width: 10px;
    height: 20px;
    background-color: #8e9eab;
    border-radius: 10px 0 0 10px;
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    cursor: pointer;

    &:hover {
      background-color: #146ec2;
    }
  }

  &.fade_r {
    width: 0;
  }
}

.el-aside-left {
  overflow: visible;
  position: relative;
  transition: width .2s linear;

  .title {
    font-size: 15px;
    text-align: center;
    padding: 20px 0;
    margin-bottom: 0;
    margin-top: 0;
    border-bottom: 1px solid rgb(222, 219, 219);
    background: linear-gradient(to right, #8e9eab, #d0d7d8);
    border-radius: 20px 20px 0 0;
  }

  .icons {
    display: flex;
    justify-content: center;
  }

  .click {
    width: 10px;
    height: 20px;
    background-color: #8e9eab;
    border-radius: 0 10px 10px 0;
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    cursor: pointer;

    &:hover {
      background-color: #146ec2;
    }
  }

  &.fade {
    width: 0;
  }
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  border-radius: 8px;
  border: 1px solid transparent;
}

.el-scrollbar-info {
  height: calc(100% - 57px);
  width: 100%;
  padding: 0 10px;
}

:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  border-bottom-color: transparent;
}

.canvas-wrapper {
  padding-top: 0;
  display: flex;
  padding-right: 0;
  overflow: hidden;

  .title {
    font-size: 17px;
    text-align: center;
    margin: 0;
    width: 100%;
    height: 58px;
    line-height: 58px;
    background: linear-gradient(to right, #8e9eab, #d0d7d8);
    border-radius: 20px 20px 0 0;
  }

  .container {
    width: 100%;
    height: calc(100% - 57px);
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    border-radius: 0 0 20px 20px;
    background-color: #fff;
    position: relative;
    z-index: 1;
    overflow: hidden;
    display: flex;
  }

  .graph-container {
    width: 100%;
    height: 100% !important;
    flex: 1 1;
  }
}

.aside-title {
  font-size: 15px;
  text-align: center;
  padding: 20px 0;
  margin-bottom: 0;
  margin-top: 0;
  border-bottom: 1px solid rgb(222, 219, 219);
  background: linear-gradient(to right, #8e9eab, #d0d7d8);
}

.el-footer {
  margin-left: 20px;
  padding: 0;
  height: 227px;
  position: relative;
  z-index: 10;
  transition: height .2s linear;

  .icon-info {
    margin-left: 20px;
    transition: opacity .2s linear;

    i {
      font-size: 18px;
      cursor: pointer;
      transition: ease-in-out .1s;

      &:hover {
        color: rgb(21, 210, 147);
      }
    }

    &.op {
      opacity: 0;
    }
  }

  .terminal {
    width: 100%;
    height: 200px;
    background-color: #fff;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    border-radius: 0 0 20px 20px;
    margin-top: 8px;
  }

  .button-group {
    width: 100%;
    border: 1px solid #f0f0f4;
  }

  .terminal-item {
    width: 100%;
    height: calc(100% - 34px);
  }

  .out {
    width: 20px;
    height: 10px;
    background-color: #8e9eab;
    border-radius: 10px 10px 0 0;
    position: absolute;
    right: 50%;
    top: 18px;
    transform: translateX(-50%);
    z-index: 10;
    cursor: pointer;

    &:hover {
      background-color: #146ec2;
    }

    &.h {
      top: 10px;
    }
  }

  &.fade {
    height: 0;
  }
}

:deep(.g6-component-contextmenu) {
  padding: 8px 0;
}

.drawer {
  /* width: 25%; */
  padding: 60px 0 20px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  background-color: #fff;
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform .3s ease-in-out;

  .panel-title {
    padding: 5px 10px;
    background-color: #e4e4e4;
    font-size: 15px;
    font-weight: 600;
  }

  .config-data {
    padding: 20px;
  }

  .config-item {
    font-size: 14px;
    margin: 10px 0 20px;

    .label {
      padding: 0 16px 0 0;
    }

    .size {
      display: flex;
      flex-direction: column;
      align-items: center;

      span {
        font-size: 13px;
        color: #545556;
      }
    }
  }

  .flex {
    display: flex;
    justify-content: flex-start;
  }

  &.hidden {
    transform: translateX(0);
  }
}
</style>
