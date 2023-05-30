<template>
  <div class="test-info" :style="{ height: `${mainH}px` }">
    <shapeHeader @handleMenu="handleMenu" :canRedo="canRedo" :canUndo="canUndo"></shapeHeader>
    <el-container class="el-container-layout">
      <el-aside class="el-aside el-aside-left" :class="{ 'fade': isOut }">
        <h4 v-if="!isOut" class="title">仿真组件库</h4>
        <el-scrollbar class="el-scrollbar-info" :style="{ padding: isOut ? 0 : '0 10px' }">
          <el-menu @open="open" @close="close" id="elMenu" :collapse="isOut">
            <testElMenu :menus="menuList" :drag="true" :openFlag="openFlag"></testElMenu>
          </el-menu>
        </el-scrollbar>
        <markPoiner :isOut="isOut" :color="'#fff'" @hideMenu="hideMenu"></markPoiner>
      </el-aside>
      <el-container class="layout-wrapper">
        <div class="canvas-wrapper" :style="{ paddingBottom: isOutB ? '0' : '' }">
          <div style="width:100%; min-width: 0;">
            <h4 class="title">仿真测试环境</h4>
            <!-- canvas容器 -->
            <div id="graph" class="container" ref="graphRef">
              <div id="graph-container" class="graph-container"></div>
            </div>
          </div>
          <div class="el-aside-right" :class="{ 'fade_r': isOutR }">
            <h4 v-if="!isOutR" class="aside-title">属性栏</h4>
            <tableBar :tableList="tableList" :domH="domH" @saveTable="saveTable"></tableBar>
            <markPoiner :isOut="isOutR" :direction="'left'" :color="'#fff'" @hideMenu="outRHideMenu"></markPoiner>
          </div>
        </div>
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
          <markPoiner :class="{ 'top_mark': isOutB }" :isOut="isOutB" :direction="'top'" :color="'#fff'"
            @hideMenu="outBHideMenu"></markPoiner>
        </el-footer>
      </el-container>
    </el-container>
    <!-- 小地图 -->
    <div class="minimap_dialog"
      :style="{ left: `${minimapPoint.x}px`, top: `${minimapPoint.y}px`, visibility: minimapMark ? '' : 'hidden' }">
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
import tableBar from '@/components/business/tableBar.vue';
import testElMenu from '@/components/business/testElMenu.vue';
import shapeHeader from '@/components/common/shapeHeader.vue'
import markPoiner from '../components/common/mark/markPoiner.vue';

import { getImgSize } from '../utils/utils'
import _ from 'lodash'
import { Graph, Shape } from '@antv/x6'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { MiniMap } from '@antv/x6-plugin-minimap'
// import { Scroller } from "@antv/x6-plugin-scroller";
import insertCss from 'insert-css'
import Cookies from 'js-cookie'
import { CloseBold } from '@element-plus/icons-vue'

const instance = getCurrentInstance()
instance.proxy.$bus.on('*', (name, val) => {
  if (name === 'resize') {
    if (val !== undefined && !val) {
      mainH.value = mainH.value - 60
    } else if (val !== undefined && val) {
      mainH.value = mainH.value + 60
    }
  }
  if (name === 'dragStart') {
    dragStart(val)
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
        label: '1553B',
        drag: true,
        shape: 'image',
        img: new URL('/src/assets/image/1553b.png', import.meta.url).href,
        list: {
          name: '属性',
          code: '属性值',
          tableData: [
            {
              key: '处理器',
              value: 'BM3803'
            },
            {
              key: '频率',
              value: '50MHZ'
            },
            {
              key: '内存',
              value: '2M'
            }
          ]
        }
      },
      {
        id: '1-2',
        label: '环境扰动力/力矩模型',
        drag: true,
        shape: 'custom-rect',
        fill: '#61c0bf'
      },
      {
        id: '1-3',
        label: '数值积分轨道动力学',
        drag: true,
        shape: 'custom-circle',
        fill: '#00adb5'
      },
      {
        id: '1-4',
        label: '空间环境磁场',
        drag: true,
        shape: 'custom-ellipse',
        fill: '#ea5455'
      },
      {
        id: '1-5',
        label: '19根数外推轨道动力学',
        drag: true,
        shape: 'custom-polygon-rhombus',
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
        shape: 'custom-polygon-quad'
      },
      {
        id: '2-2',
        label: '双轴模拟太阳敏感器组',
        drag: true,
      },
      {
        id: '2-3',
        label: '捷联惯组模型',
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
        label: '激光陀螺模型',
        drag: true,
        shape: 'image',
        img: new URL('../assets/image/tuoluo.jpg', import.meta.url).href
      },
      {
        id: '2-8',
        label: 'gps模型',
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
        label: 'UART',
        drag: true,
        shape: 'image',
        img: new URL('../assets/image/UART.png', import.meta.url).href
      },
      {
        id: '4-2',
        label: '遥测仿真监控',
        shape: 'image',
        drag: true,
        img: new URL('../assets/image/yaoce.png', import.meta.url).href
      },
      {
        id: '4-3',
        label: '伺服机构模型',
        drag: true,
        shape: 'image',
        img: new URL('../assets/image/cifu.png', import.meta.url).href
      },
      {
        id: '4-4',
        label: '动力学模型',
        drag: true,
        shape: 'image',
        img: new URL('../assets/image/donglixue.png', import.meta.url).href
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
  {
    id: '9',
    label: '箭载计算机',
    drag: true,
    shape: 'image',
    img: new URL('../assets/image/jisuanji.png', import.meta.url).href,
    list: {
      name: '属性',
      code: '属性值',
      tableData: [
        {
          key: '处理器',
          value: 'BM3803'
        },
        {
          key: '频率',
          value: '50MHZ'
        },
        {
          key: '内存',
          value: '2M'
        },
        {
          key: '15538_1',
          value: '10'
        },
        {
          key: 'UART_1',
          value: '2'
        },
        {
          key: 'UART_2',
          value: '3'
        },
        {
          key: '15538_2',
          value: '15'
        },
        {
          key: '15538_3',
          value: '12'
        },
        {
          key: '15538_4',
          value: '18'
        },
      ]
    }
  },
  {
    id: '10',
    label: '时序模型',
    drag: true,
    shape: 'image',
    img: new URL('../assets/image/shixu.png', import.meta.url).href,
    list: {
      name: '时序',
      code: '事件',
      tableData: [
        {
          key: '-40.0',
          value: '摆杆牵动'
        },
        {
          key: '-30.0',
          value: '摆杆摆开到位'
        },
        {
          key: '-3.0',
          value: '点火'
        },
        {
          key: '+0.0',
          value: '起飞'
        },
        {
          key: '+12.0',
          value: '程序转弯'
        },
        {
          key: '+120.0',
          value: '逃逸塔分离'
        },
        {
          key: '+154.80',
          value: '助推器分离'
        },
        {
          key: '',
          value: '芯一级预令关机'
        },
        {
          key: '+159.0',
          value: '芯一级主令关机'
        },
        {
          key: '+159.50',
          value: '一二级分离'
        },
      ]
    }
  },
])
const openFlag = ref({})
const tableList = ref([])
const domH = ref(0)
const mainH = ref('')
const isOut = ref(false)
const isOutR = ref(false)
const isOutB = ref(false)
const dragItem = ref('')
const canUndo = ref(false) // 是否能撤销
const canRedo = ref(false) // 是否能重做
const minimapPoint = reactive({
  x: '',
  y: ''
})
const minimapMark = ref(false)

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
      group: 'left'
    },
    {
      id: 'prot6',
      group: 'left'
    },
    {
      id: 'prot7',
      group: 'left'
    },
    {
      id: 'prot8',
      group: 'left'
    },
    {
      id: 'prot9',
      group: 'right'
    },
    {
      id: 'prot10',
      group: 'right'
    },
    {
      id: 'prot11',
      group: 'right'
    },
    {
      id: 'prot12',
      group: 'right'
    },
    {
      id: 'prot13',
      group: 'bottom'
    },
    {
      id: 'prot14',
      group: 'bottom'
    },
    {
      id: 'prot15',
      group: 'bottom'
    },
    {
      id: 'prot16',
      group: 'bottom'
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
        }
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
    }
  }
}

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
// 开始拖动
const dragStart = (item) => {
  dragItem.value = item
  // 元素行为 移动
  graphRef.value.addEventListener("dragenter", dragenter);
  // 目标元素经过 禁止默认事件
  graphRef.value.addEventListener("dragover", dragover);
  // 离开目标元素设置元素的放置行为  不能拖放
  graphRef.value.addEventListener("dragleave", dragleave);
  // 拖动元素在目标元素松手时添加元素到画布
  graphRef.value.addEventListener("drop", drop);
}
const dragenter = (e) => {
  e.dataTransfer.dropEffect = "move"
}
const dragover = (e) => {
  e.preventDefault()
}
const dragleave = (e) => {
  e.dataTransfer.dropEffect = "none"
}
// 拖动松开添加节点
const drop = (e) => {
  if (dragItem.value.img) {
    getImgSize(dragItem.value.img).then((res) => {
      graph.addNode({
        shape: dragItem.value.shape,
        x: e.layerX,
        y: e.layerY,
        width: res.width,
        height: res.height,
        label: dragItem.value.label,
        attrs: {
          image: {
            'xlink:href': dragItem.value.img
          },
          label: {
            refX: 0.5, // 标题水平位置
            refY: '100%',// 标题垂直位置
            refY2: 6, // 标题和节点之间的距离
            textAnchor: 'middle',
            textVerticalAnchor: 'top',
            fontSize: 12,
            fill: '#333',
          },
        },
        ports: { ...ports },
        list: dragItem.value.list
      })
    })
  } else {
    const node = graph.addNode({
      shape: dragItem.value.shape !== undefined ? dragItem.value.shape : 'custom-rect',
      x: e.layerX,
      y: e.layerY,
      width: dragItem.value.shape === 'circle' ? 70 : 100,
      height: 70,
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
      // ports: dragItem.value.shape === 'ellipse' ? { ...ellipsePorts } : dragItem.value.shape === 'circle' ? { ...absolutePorts } : { ...ports },
      list: dragItem.value.list
    })
    if (dragItem.value.shape === 'custom-ellipse') {
      Array.from({ length: 10 }).forEach((_, index) => {
        node.addPort({
          id: `${index}`,
          group: 'ellipse',
          // attrs: { text: { text: index } },
        })
      })
    }
  }

  graphRef.value.removeEventListener("dragenter", dragenter);
  graphRef.value.removeEventListener("dragover", dragover);
  graphRef.value.removeEventListener("dragleave", dragleave);
  graphRef.value.removeEventListener("drop", drop);
  setTimeout(() => {
    dragItem.value = null
  }, 400)
}
// 控制连接桩显示/隐藏
const showPorts = (ports, show) => {
  for (let i = 0, len = ports.length; i < len; i += 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden'
  }
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
      }
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
      ports: { ...absolutePorts }
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
      ports: { ...ports },
    },
    true,
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
    true,
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
    true,
  )
  // #endregion
  const parentDom = document.getElementById('graph')
  const graphDom = document.getElementById('graph-container')
  graph = new Graph({
    container: graphDom,
    width: parentDom.clientWidth,
    height: parentDom.clientHeight,
    grid: true,
    panning: {
      enabled: true // 开启拖拽平移
    },
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
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
  })
  // 使用插件
  graph
    .use(
      new Transform({
        resizing: true,
        rotating: true,
      }),
    )
    .use(
      new Selection({
        rubberband: true,
        showNodeSelectionBox: true,
        modifiers: ['ctrl', 'meta'] // 防止拖拽平移冲突，配合快键键框选
      }),
    )
    .use(new Snapline())
    .use(new Keyboard())
    .use(new Clipboard())
    .use(new History({
      enabled: true,
    }))
    .use(new MiniMap({
      container: document.getElementById('minimap'),
      width: document.getElementById('minimap').clientWidth,
      height: document.getElementById('minimap').clientHeight
    }))

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
      border: 1px solid #239edd;
    }
    .x6-widget-transform > div {
      border: 1px solid #239edd;
    }
    .x6-widget-transform > div:hover {
      background-color: #3dafe4;
    }
    .x6-widget-transform-active-handle {
      background-color: #3dafe4;
    }
    .x6-widget-transform-resize {
      border-radius: 0;
    }
    .x6-widget-selection-inner {
      border: 1px solid #239edd;
    }
    .x6-widget-selection-box {
      opacity: 0;
    }
  `)
  graph.fromJSON(graphData.value.cells)
}
// 初始化图事件
const initGraphEvent = () => {
  graph.on("node:mouseenter", (e) => {
    const container = document.getElementById('graph-container')
    const ports = container.querySelectorAll('.x6-port-body')
    showPorts(ports, true)
  })
  graph.on("node:mouseleave", (e) => {
    const container = document.getElementById('graph-container')
    const ports = container.querySelectorAll('.x6-port-body')
    showPorts(ports, false)
  })
  graph.on('node:click', (e) => {
    // 右侧表格数据
    tableList.value = e.node.store.data.list
  })
  graph.on('edge:click', (e) => {
    console.log(e);
    console.log(graph.toJSON());
    tableList.value = []
  })
  graph.on('history:change', ({ cmds, options }) => {
    canUndo.value = graph.canUndo()
    canRedo.value = graph.canRedo()
  })
}
// 保存数据
const saveToJson = () => {
  localStorage.setItem('emulationData', JSON.stringify(graph.toJSON()))
}
const saveTable = (data) => {
  // saveToJson()
}
const hideMenu = () => {
  isOut.value = !isOut.value
}
const outRHideMenu = () => {
  isOutR.value = !isOutR.value
}
const outBHideMenu = () => {
  isOutB.value = !isOutB.value
  // setTimeout(() => {
  tableSize()
  // }, 300)
}
const handleMenu = (val) => {
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
  if (val === '格式') {
    let booleanArr = [isOut.value, isOutR.value, isOutB.value]
    let falseFlag = booleanArr.filter(item => {
      return item === false
    })
    let trueFlag = booleanArr.filter(item => {
      return item === true
    })
    if (falseFlag.length > trueFlag.length) {
      isOut.value = true
      isOutR.value = true
      isOutB.value = true
    }
    if (trueFlag.length > falseFlag.length) {
      isOut.value = false
      isOutR.value = false
      isOutB.value = false
    }
  }
  if (val === '保存') {
    saveToJson()
    instance.proxy.$axios.saveTaskDetail({
      taskId: Cookies.get('taskId'),
      daTree: JSON.stringify(graph.toJSON())
    }).then((res) => {
      console.log(res);
    })
  }
  if (val === '缩略图') {
    minimapMark.value = !minimapMark.value
    if (minimapMark.value === false) {
      minimapPoint.x = 1017
      minimapPoint.y = 50
    }
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
  const localList = localStorage.getItem('emulationData')
  if (localList !== null) {
    graphData.value = JSON.parse(localList)
  }
  createGraphic()
  initGraphEvent()
  tableSize()
  // instance.proxy.$axios.getTaskDetail({ taskId: Cookies.get('taskId') }).then((res) => {
  //   // console.log(res);
  //   if (res.data !== null) {
  //     graphData.value = JSON.parse(res.data.daTree)
  //   }
  //   createGraphic()
  //   initGraphEvent()
  // })
})

function tableSize() {
  nextTick(() => {
    if (isOutB.value) {
      domH.value = window.innerHeight - 248
    } else {
      domH.value = window.innerHeight - 476
    }
    mainH.value = window.innerHeight - 158
  })
  window.onresize = () => {
    if (isOutB.value) {
      domH.value = window.innerHeight - 248
    } else {
      domH.value = window.innerHeight - 476
    }

    mainH.value = window.innerHeight - 158
  }
}

onUnmounted(() => {
  window.onresize = null
  window.removeEventListener('resize', () => { })
})
</script>

<style lang="scss" scoped>
.test-info {
  height: 100%;
  margin: 0 20px;
  background-color: #f4f4f4;
  border-radius: 3px;
  transition: height .2s linear;
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.2);
  position: relative;
}

.el-container-layout {
  width: 100%;
  height: calc(100% - 41px);
}

.el-aside {
  width: 220px;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 0;
  background-color: #fff;
}

.el-aside-right {
  margin-left: 10px;
  border-radius: 3px;
  position: relative;
  z-index: 10;
  width: 260px;
  transition: width .2s linear;

  .aside-title {
    /* border-radius: 3px 3px 0 0; */
  }

  &:hover {
    .click {
      opacity: 1;
    }
  }

  &.fade_r {
    width: 0;
  }
}

.el-aside-left {
  margin-left: 10px;
  overflow: visible;
  position: relative;
  transition: width .2s linear;

  .title {
    font-size: 15px;
    text-align: center;
    padding: 11px 0;
    margin-bottom: 0;
    margin-top: 0;
    border-bottom: 1px solid rgb(222, 219, 219);
    background: #d0d7d8;
    /* border-radius: 3px 3px 0 0; */
  }

  .icons {
    display: flex;
    justify-content: center;
  }

  &.transform {
    width: 0;
  }

  &:hover {
    .click {
      opacity: 1;
    }
  }

  &.fade {
    width: 0;
  }
}

.el-scrollbar-info {
  height: calc(100% - 60px);
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
  flex: 1;
  padding: 0 10px 0 10px;
  overflow: hidden;

  .title {
    font-size: 17px;
    text-align: center;
    margin: 0;
    width: 100%;
    padding: 11px 0;
    background: #d0d7d8;
    border-radius: 3px 3px 0 0;
  }

  .container {
    width: 100%;
    height: calc(100% - 50px);
    border-radius: 0 0 3px 3px;
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
  padding: 11px 0;
  margin-bottom: 0;
  margin-top: 0;
  border-bottom: 1px solid rgb(222, 219, 219);
  background: #d0d7d8;
}

.el-footer {
  margin-left: 10px;
  margin-right: 10px;
  padding: 0;
  height: 227px;
  position: relative;
  z-index: 10;
  transition: height .2s linear;

  .icon-info {
    margin-left: 20px;
    transition: opacity .2s linear;

    i {
      display: inline-block;
      width: 20px;
      height: 20px;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
      border-radius: 2px;
      transition: ease-in-out .1s;

      &:hover {
        color: #fff;
        background-color: #4c91fa;
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
    border-radius: 0 0 3px 3px;
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

  &.fade {
    height: 0;
  }

  &:hover {
    .click {
      opacity: 1;
    }
  }

  /* .top_mark{
    bottom: -17px;
  } */
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  border-radius: 8px;
  border: 1px solid transparent;
}

.minimap_dialog {
  position: absolute;
  left: 1017px;
  top: 50px;
  z-index: 99;
  width: 180px;
  height: 180px;
  border-radius: 5px;
  box-shadow: 0px 0px 2px #C0C0C0;

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
