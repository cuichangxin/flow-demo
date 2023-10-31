<template>
  <div class="management">
    <el-button type="primary" :disabled="disabled" @click="addDemandRelation">保存</el-button>
    <div class="select-wrapper">
      <el-select v-model="leftValue" placeholder="请选择需求" @change="onChange">
        <el-option v-for="item in rowSelectList" :key="item.label" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="rightValue" placeholder="请选择需求" @change="onChange">
        <el-option
          v-for="item in columnSelectList"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div id="container" style="display: flex; justify-content: space-around; position: relative">
      <el-tree
        :data="treeData_left"
        :default-expand-all="true"
        node-key="key"
        :props="{ class: 'leftROW' }"
        :expand-on-click-node="false"
        ref="leftTreeRef"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
      <el-tree
        :data="treeData_right"
        :default-expand-all="true"
        node-key="key"
        :props="{ class: 'rightROW' }"
        :expand-on-click-node="false"
        ref="rightTreeRef"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </div>
    <div v-if="contextmenuFlag" class="contextmenu_wrapper" @click="contextmenuFlag = false">
      <ul class="contextmenu_info" :style="{ left: `${position.x}px`, top: `${position.y}px` }">
        <li @click="removeLine">删除</li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { jsPlumb } from 'jsplumb'
import { nextTick } from 'vue'

let instance = null

const { proxy } = getCurrentInstance()

const treeData_left = ref([])
const treeData_right = ref([])
const relationData = ref([])
const relationship = ref([]) // 默认连线数据
const leftTreeRef = ref(null)
const rightTreeRef = ref(null)
const disabled = ref(true)
const contextmenuFlag = ref(false)
const position = reactive({
  x: '',
  y: '',
})
const lineConn = ref({})
const relationDirection = ref(0)
const leftValue = ref('testCase')
const rightValue = ref('need')
const rowSelectList = reactive([
  {
    value: 'software',
    label: '软件架构',
  },
  {
    value: 'testCase',
    label: '测试用例',
  },
])
const columnSelectList = reactive([
  {
    value: 'need',
    label: '软件需求',
  },
  {
    value: 'columntestCase',
    label: '测试用例',
  },
])

const postTaskId = computed(() => {
  if (leftValue.value === 'testCase' && rightValue.value === 'need') {
    return 1002
  } else if (leftValue.value === 'software' && rightValue.value === 'need') {
    return 1003
  } else if (leftValue.value === 'software' && rightValue.value === 'columntestCase') {
    return 1004
  } else if (leftValue.value === 'testCase' && rightValue.value === 'columntestCase') {
    return 1005
  }
})

const getData = () => {
  return new Promise((resolve, reject) => {
    proxy.$axios.getDemandList({ demandId: leftValue.value }).then((res) => {
      treeData_left.value = JSON.parse(res.data.daTree).rowTree
      changTreeNode(treeData_left.value, 'left')
      proxy.$axios.getDemandList({ demandId: rightValue.value }).then((res) => {
        treeData_right.value = JSON.parse(res.data.daTree).columnTree
        changTreeNode(treeData_right.value, 'right')
        resolve('success')
      })
    })
  })
}
// 处理默认连线的数据
const getRelationData = () => {
  proxy.$axios.getTaskDetail({ taskId: postTaskId.value }).then((res) => {
    relationData.value = JSON.parse(res.data.daTree)
    let formatData = Object.entries(relationData.value.cellRelation)
    relationDirection.value = relationData.value.tracking
    formatData.forEach((item) => {
      if (item[1].length) {
        item[1].forEach((e) => {
          if (relationDirection.value === 0) {
            relationship.value.push({
              sourceId: item[0],
              targetId: e,
            })
          } else {
            relationship.value.push({
              sourceId: e,
              targetId: item[0],
            })
          }
        })
      }
    })
  })
}

// 递归添加新的id，方便画线
const changTreeNode = (tree, target) => {
  tree.forEach((item) => {
    if (target === 'left') {
      item.nodeId = `Id_left_${item.key}`
    }
    if (target === 'right') {
      item.nodeId = `Id_right_${item.key}`
    }
    if (item?.children) {
      changTreeNode(item.children, target)
    }
  })
}
const addDemandRelation = () => {
  proxy.$axios.saveTaskDetail({ taskId: postTaskId.value, daTree: JSON.stringify(relationData.value) }).then((res) => {
    disabled.value = true
    proxy.$modal.msgSuccess('保存成功')
  })
}

function init() {
  instance = jsPlumb.getInstance({
    Connector: 'Straight', //连接线形状 Bezier: 贝塞尔曲线 Flowchart: 具有90度转折点的流程线 StateMachine: 状态机 Straight: 直线
    PaintStyle: {
      strokeWidth: 2,
      stroke: '#c2ccd0',
    }, //连接线样式
    Endpoint: ['Blank', { radius: 1 }], //端点
    anchor: 'Right',
    // 绘制箭头
    Overlays: [['Arrow', { width: 8, length: 8, location: 1 }]],
    EndpointStyle: { fill: '#000' }, //端点样式
    Container: 'container', //目标容器id
    ListStyle: {
      endpoint: ['Rectangle', { width: 30, height: 30 }],
    },
    HoverPaintStyle: { stroke: '#0069f3', strokeWidth: 4 },
  })
}
function setContainer() {
  const leftElList = document.querySelectorAll('.leftROW') // 左侧tree节点集合
  const rightElList = document.querySelectorAll('.rightROW') // 右侧tree节点集合
  // 这里的循环是因为树节点下自定义内容宽度没有撑满，连线显示效果不好，所有改成使用 el-tree-node__content
  leftElList.forEach((item) => {
    const key = item.getAttribute('data-key')
    item.childNodes[0].classList.add(`left_Id_${key}`, 'left-node')
    item.childNodes[0].childNodes[0].style.pointerEvents = 'none' // 禁止三角图标的事件
  })
  rightElList.forEach((item) => {
    const key = item.getAttribute('data-key')
    item.childNodes[0].classList.add(`right_Id_${key}`, 'right-node')
    item.childNodes[0].childNodes[0].style.pointerEvents = 'none' // 禁止三角图标的事件
  })
  const leftNodeList = document.querySelectorAll('.left-node') // 左侧连线节点集合
  const rightNodeList = document.querySelectorAll('.right-node') // 右侧连线节点集合
  // 将dom元素设置为连线的起点或者终点 设置了起点的元素才能开始连线 设置为终点的元素才能为连线终点
  instance.batch(function () {
    ;[leftNodeList, rightNodeList].forEach((trList, index) => {
      trList.forEach((tr) => {
        if (relationDirection.value === 0) {
          if (index === 0) {
            instance.makeSource(tr, {
              allowLoopback: false,
              anchor: ['Right'], // 设置端点位置
            })
          } else {
            instance.makeTarget(tr, {
              anchor: ['Left'],
            })
          }
        } else {
          if (index === 1) {
            instance.makeSource(tr, {
              allowLoopback: false,
              anchor: ['Left'], // 设置端点位置
            })
          } else {
            instance.makeTarget(tr, {
              anchor: ['Right'],
            })
          }
        }
      })
    })
  })
  // 连线建立前调用
  instance.bind('beforeDrop', (evt) => {
    let id = document.getElementById(evt.sourceId).classList[1].split('_')[2]
    if (id.indexOf('-') === -1) {
      proxy.$modal.msgError('该需求不可建立关系')
      return false
    } else {
      return true
    }
  })
  // 连线建立完成调用
  instance.bind('connection', (evt) => {
    // console.log(evt)
    let leftRowId
    let rightRowId
    if (relationDirection.value === 0) {
      leftRowId = evt.source.classList[1].split('_')[2]
      rightRowId = evt.target.classList[1].split('_')[2]
    }else {
      leftRowId = evt.target.classList[1].split('_')[2]
      rightRowId = evt.source.classList[1].split('_')[2]
    }
    let hasNode = relationData.value.cellRelation[leftRowId]
    if (!hasNode.includes(rightRowId)) {
      hasNode.push(rightRowId)
      disabled.value = false
      leftElList.forEach((el) => {
        changeNodeBg(el, leftRowId)
      })
      rightElList.forEach((el) => {
        changeNodeBg(el, rightRowId)
      })
    }
    // console.log(relationData.value);
  })
  // 右键事件
  instance.bind('contextmenu', (c, e) => {
    contextmenuFlag.value = true
    position.x = e.pageX
    position.y = e.pageY
    lineConn.value = c
  })
}

const changeNodeBg = (el, rowId) => {
  let dataKey = el.getAttribute('data-key')
  if (dataKey === rowId) {
    el.childNodes[0].style.background = '#206CCF'
    el.childNodes[0].style.color = '#fff'
  }
}
const removeLine = () => {
  const leftDom = document.getElementById(lineConn.value.sourceId)
  const rightDom = document.getElementById(lineConn.value.targetId)
  const leftId = leftDom.classList[1].split('_')[2]
  const rightId = rightDom.classList[1].split('_')[2]
  const index = relationData.value.cellRelation[leftId].findIndex((item) => {
    return item === rightId
  })
  relationData.value.cellRelation[leftId].splice(index, 1)
  instance.deleteConnection(lineConn.value)
  const hasNode = relationData.value.cellRelation[leftId]
  const flatCell = Object.values(relationData.value.cellRelation).flat(Infinity)
  const sizeObj = keysSize(flatCell)
  // 左侧
  if (!hasNode.length) {
    leftDom.style.background = 'transparent'
    leftDom.style.color = '#606266'
  }
  // 右侧
  if (!sizeObj.hasOwnProperty(rightId)) {
    rightDom.style.background = 'transparent'
    rightDom.style.color = '#606266'
  }
  disabled.value = false
}

const onChange = () => {
  treeData_left.value = []
  treeData_right.value = []
  relationship.value = []
  instance.deleteEveryConnection()
  instance.deleteEveryEndpoint()
  instance.reset()
  initJsPlumb()
}

// 设置默认连线
function setConnect(relationship) {
  const leftElList = document.querySelectorAll('.leftROW') // 左侧tree节点集合
  const rightElList = document.querySelectorAll('.rightROW') // 右侧tree节点集合
  setTimeout(() => {
    relationship.forEach(function (data) {
      // source是连线起点元素id target是连线终点元素id
      if (relationDirection.value == 0) {
        instance.connect({
          source: document.querySelector(`.left_Id_${data.sourceId}`),
          target: document.querySelector(`.right_Id_${data.targetId}`),
        })
      } else {
        instance.connect({
          source: document.querySelector(`.right_Id_${data.sourceId}`),
          target: document.querySelector(`.left_Id_${data.targetId}`),
        })
      }
      leftElList.forEach((el) => {
        if (relationDirection.value === 0) {
          changeNodeBg(el, data.sourceId)
        }else {
          changeNodeBg(el, data.targetId)
        }
      })
      rightElList.forEach((el) => {
        if (relationDirection.value === 0) {
          changeNodeBg(el, data.targetId)
        }else {
          changeNodeBg(el, data.sourceId)
        }
      })
    })
  })
}
function keysSize(arr) {
  return arr.reduce((obj, key) => {
    if (key in obj) {
      obj[key]++
    } else {
      obj[key] = 1
    }
    return obj
  }, {})
}

const initJsPlumb = () => {
  getRelationData()
  getData().then((res) => {
    jsPlumb.ready(function () {
      init()
      setConnect(relationship.value)
      setContainer()
      setTimeout(() => {
        window.addEventListener('resize', () => {
          instance.repaintEverything()
        })
        nextTick(() => {
          disabled.value = true
        })
        disabled.value = false
      })
    })
  })
}
onMounted(() => {
  initJsPlumb()
  window.addEventListener('contextmenu', (evt) => {
    evt.preventDefault()
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
  window.removeEventListener('contextmenu', () => {})
})
</script>
<style lang="scss" scoped>
.management {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  #container {
    width: 100%;
  }
  :deep(.el-tree) {
    border-radius: 4px;
    background-color: var(--my-bg-color);
    width: 400px;
    min-height: 400px;
    .el-tree-node__content {
      margin: 1px 0;
    }
  }
}
.custom-tree-node {
  flex: 1;
}
.el-button {
  position: fixed;
  right: 40px;
  top: 70px;
  z-index: 99;
}
.contextmenu_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.contextmenu_info {
  list-style: none;
  width: 100px;
  background-color: #fff;
  font-size: 14px;
  padding: 6px 0;
  position: fixed;
  li {
    height: 25px;
    padding: 0 10px;
    margin: 2px 0;
    line-height: 25px;
    cursor: pointer;
    &:hover {
      background-color: #f2f3f5;
    }
  }
}
.select-wrapper {
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin: 0 0 30px;
}
</style>
