<template>
  <div class="go_back_wrapper">
    <div class="select_wrapper">
      <div class="element">
        <label>行元素类型：</label>
        <el-select v-model="rowValue" placeholder="请选择" @change="changeRow">
          <el-option v-for="item in rowSelectList" :key="item.label" :value="item.value" :label="item.label">
          </el-option>
        </el-select>
      </div>
      <div class="element">
        <label>列元素类型：</label>
        <el-select v-model="columnValue" placeholder="请选择" @change="changeColumn">
          <el-option v-for="item in columnSelectList" :key="item.label" :value="item.value" :label="item.label">
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="table_wrapper">
      <div class="table_info">
        <div class="content">
          <div class="w">
            <!-- 左侧顶部盒子 -->
            <div class="top-left-box" :style="{ height: leftBlankH + 1 + 'px' }">
              <div class="blank">
                <div class="cell-item"></div>
              </div>
            </div>
            <!-- 左侧行 -->
            <div class="tree_box_info">
              <el-tree
                v-if="isShow"
                :data="rowTree"
                node-key="key"
                :indent="treeProps.indent"
                default-expand-all
                :expand-on-click-node="false"
                @node-collapse="leftCollapseHandler"
                @node-expand="leftExpandHandler"
              >
                <template v-slot:default="{ node, data }">
                  <element-tree-line
                    :node="node"
                    :showLabelLine="true"
                    :style="{
                      background: data.linkNum === 0 && data.key.indexOf('-') !== -1 ? '#e46a64' : '',
                      color: data.linkNum === 0 && data.key.indexOf('-') !== -1 ? '#fff' : '',
                    }"
                  >
                    <template v-slot:node-label>
                      <img
                        v-if="data.children"
                        class="back-pic"
                        style="margin: 0 5px 0 0"
                        src="../assets/image/back-wenjianjia.png"
                      />
                      <img v-else class="back-pic" style="margin: 0 5px 0 0" src="../assets/image/back-wenjian.png" />
                      <span>{{ node.label }}</span>
                    </template>
                    <template v-slot:after-node-label>
                      <div class="num_box">
                        <div
                          class="cell-item"
                          :style="{ background: data.linkNum === 0 && data.key.indexOf('-') !== -1 ? '#e46a64' : '' }"
                        >
                          {{ data.linkNum === 0 ? '' : data.linkNum }}
                        </div>
                      </div>
                    </template>
                  </element-tree-line>
                </template>
              </el-tree>
            </div>
          </div>

          <el-scrollbar class="flex">
            <!-- 顶部列 -->
            <div class="top-column" ref="topColumn">
              <el-tree
                v-if="isShow"
                :data="columnTree"
                node-key="key"
                :indent="0"
                default-expand-all
                @node-collapse="topCollapseHandler"
                @node-expand="topExpandHandler"
              >
                <template #default="{ node, data }">
                  <span
                    class="custom-tree-node"
                    :style="{ background: data.isRelation ? '#e46a64' : '', color: data.isRelation ? '#fff' : '' }"
                  >
                    {{ data.length }}
                    <span v-if="data.key.indexOf('-') !== -1" class="element-top-line"></span>
                    <img v-if="data.children" class="back-pic" src="../assets/image/back-wenjianjia.png" />
                    <img style="margin: 0 0 5px 0" v-else class="back-pic" src="../assets/image/back-wenjian.png" />
                    <span class="tree-label">{{ node.label }}</span>
                    <span
                      v-if="data.key.indexOf('-') !== -1"
                      :style="{ width: data.isLast ? '50%' : '' }"
                      class="element-land-line"
                    ></span>
                    <span class="element-after-line"></span>
                  </span>
                </template>
              </el-tree>
            </div>
            <!-- 中间交集格子 -->
            <div class="mid_cell" :style="{ width: midWidth + 'px' }" v-for="(node, index) in rowTree" :key="index">
              <div class="cell-info">
                <div
                  v-for="(d, i) in node.parentNodeCells"
                  :key="i"
                  class="cell-item"
                  :style="{
                    borderRight: i === node.parentNodeCells.length - 1 ? 'none' : '',
                    background: d.value === '' && d.key.indexOf('-') !== -1 ? '#e46a64' : '',
                    borderLeftColor: i == 0 ? 'transparent' : '',
                  }"
                  v-show="!d.isCollapse"
                >
                  {{ d.value }}
                </div>
              </div>
              <div
                v-for="(item, idx) in node.cells"
                :key="idx"
                class="cell"
                :style="{
                  background: item.isRelation === false ? '#e46a64' : '',
                }"
                v-show="!item.isCollapse && !item.isDbCollapse"
              >
                <img
                  v-if="item.isArrows"
                  class="img_jiantou"
                  src="../assets/image/arrows.png"
                  :style="{ transform: tracking === 0 ? '' : 'rotate(180deg)' }"
                />
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { add } from 'lodash'
import Axios from 'axios'

const { proxy } = getCurrentInstance()
const treeProps = {
  indent: 16,
  showLabelLine: true,
}
const rowValue = ref('testCase')
const columnValue = ref('need')
const leftBlankH = ref('')
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
    value: 'testCase',
    label: '测试用例',
  },
])
const rowTree = ref([]) // 左侧行数据
const columnTree = ref([]) // 顶部列数据
const midWidth = ref('') // 中间格子集合宽度
const cellRelation = ref({}) // 中间格子交集数据
const isShow = ref(false)
const topColumn = ref(null)
const columnNum = ref(0)
const cellGroup = ref({})
const tracking = ref(0)
const timer = ref(null)

const leftCollapseHandler = (data) => {
  const arr = data.children.map((item) => {
    item.isCollapse = true
    return item.key
  })
  collapseTree(rowTree.value, arr, 'rowKey', true)
}
const leftExpandHandler = (data) => {
  const arr = data.children.map((item) => {
    item.isCollapse = false
    return item.key
  })
  collapseTree(rowTree.value, arr, 'rowKey', false)
}

const topCollapseHandler = (data, node) => {
  const arr = data.children.map((item) => {
    item.isCollapse = true
    return item.key
  })
  collapseTree(rowTree.value, arr, 'key', true)
  columnNum.value = columnNum.value - arr.length
  midWidth.value = columnNum.value * 40
}

const topExpandHandler = (data, node) => {
  const arr = data.children.map((item) => {
    item.isCollapse = false
    return item.key
  })
  collapseTree(rowTree.value, arr, 'key', false)
  columnNum.value = columnNum.value + arr.length
  midWidth.value = columnNum.value * 40
}

function collapseTree(tree, includes, key, show) {
  tree.forEach((item) => {
    item.cells.forEach((cell) => {
      if (includes.includes(cell[key])) {
        cell.isCollapse = show
      }
    })
    item.parentNodeCells.forEach((node) => {
      if (includes.includes(node[key])) {
        node.isCollapse = show
      }
    })
  })
}
const changeRow = (val) => {
  postAll()
  isShow.value = false
  cellGroup.value = {}
  columnNum.value = 0
}
const changeColumn = (val) => {
  postAll()
  isShow.value = false
  cellGroup.value = {}
  columnNum.value = 0
}
const getRowInfo = () => {
  return new Promise((resolve, reject) => {
    Axios.get(`http://localhost:8080/mock/goBackData/rowel/${rowValue.value}.json`).then((res) => {

    // Axios.get(`/assets/mock/goBackData/rowel/${rowValue.value}.json`).then((res) => {
      resolve(res.rowTree)
    })
  })
}
function getColumnInfo() {
  return new Promise((resolve, reject) => {
    Axios.get(`http://localhost:8080/mock/goBackData/columnel/${columnValue.value}.json`).then((res) => {

    // Axios.get(`/assets/mock/goBackData/columnel/${columnValue.value}.json`).then((res) => {
      resolve(res.columnTree)
    })
  })
}
function getUnite() {
  return new Promise((resolve, reject) => {
    // Axios.get(`http://192.168.162.124:8080/mock/goBackData/unite/${rowValue.value + columnValue.value}.json`).then((res) => {
    //   resolve(res)
    // })
    proxy.$axios.getTaskDetail({ taskId: 1002 }).then((res) => {
      resolve(JSON.parse(res.data.daTree))
    })
  })
}
function postAll() {
  Promise.all([getRowInfo(), getColumnInfo(), getUnite()]).then((res) => {
    rowTree.value = res[0]
    columnTree.value = res[1]
    cellRelation.value = res[2].cellRelation
    tracking.value = res[2].tracking
    initMatrix()
  })
}

// 中间cell对应的关系
function deepCell(tree, data, cellArr, flatCell, rowKeysArr) {
  cellArr.push(data.length)
  data.forEach((item) => {
    if (!rowKeysArr.includes(item.key)) {
      rowKeysArr.push(item.key)
    }
    nextTick(() => {
      subGroup(tree.cells, columnNum.value, item.key)
      cellGroup.value[item.key].forEach((cell) => {
        cellRelation.value[item.key].forEach((item) => {
          if (cell.key === item) {
            cell.isArrows = true
          }
        })
        if (!flatCell.includes(cell.key)) {
          if (cell.key.indexOf('-') !== -1) {
            cell.isRelation = false
          }
        }
        if (cellRelation.value[item.key].length === 0) {
          cell.isRelation = false
        }
      })
    })

    if (item?.children) {
      deepCell(tree, item.children, cellArr, flatCell)
    }
  })
}

// 计算左侧树每个节点对应关系的数量
function deepTreeLink(tree) {
  tree.forEach((item) => {
    Object.keys(cellRelation.value).forEach((key) => {
      if (Object.keys(cellRelation.value).includes(item.key)) {
        if (item.key === key) {
          item.linkNum = cellRelation.value[key].length
        }
      } else {
        item.linkNum = 0
      }
    })
    if (item?.children) {
      deepTreeLink(item.children)
    }
  })
}

// 头部树是否存在关系
function deepRelation(tree, keysArr, flatCell) {
  columnNum.value += tree.length
  tree.forEach((item, index) => {
    if (!keysArr.includes(item.key)) {
      keysArr.push(item.key)
    }
    if (!flatCell.includes(item.key)) {
      item.isRelation = true
    }
    if (tree.length - 1 === index) {
      item.isLast = true
    }
    if (item?.children) {
      deepRelation(item.children, keysArr, flatCell)
    }
  })
}

/**
 * @description 按照长度分割数组
 * @param arr 被切割的数组
 * @param len 切割的长度
 * @param key 切割标记
 */
function subGroup(arr, len, key) {
  var newArr = {}
  var keys = parseInt(key.split('-')[key.split('-').length - 1])
  newArr[key] = new Array(1)
  for (var i = 0; i < arr.length; i += len) {
    newArr[key].push(arr.slice(i, i + len))
  }
  newArr[key].forEach(() => {
    cellGroup.value[key] = newArr[key][keys]
  })
}
// parentNodeCells对应节点出现次数
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

// 初始化
const initMatrix = () => {
  // 顶部竖向展示的条数的key集合
  let keysArr = []
  let numberTarget = 0
  let sizeObj = []
  let rowKeysArr = []
  let rowKey = 0
  const flatCell = Object.values(cellRelation.value).flat(Infinity)
  columnNum.value += columnTree.value.length
  columnTree.value.forEach((column) => {
    keysArr.push(column.key)
    if (column?.children) {
      deepRelation(column.children, keysArr, flatCell)
    }
  })
  // 动态计算中间格子集合的宽度， 单个格子宽度40
  midWidth.value = columnNum.value * 40

  rowTree.value.forEach((item) => {
    item.cellLgh = []
    item.cells = []
    item.parentNodeCells = []

    sizeObj = keysSize(flatCell)
    if (item?.children) {
      deepCell(item, item.children, item.cellLgh, flatCell, rowKeysArr)
      deepTreeLink(item.children)
    }
    item.cellLgh = add(...item.cellLgh) * columnNum.value

    for (let index = 0; index < columnNum.value; index++) {
      item.parentNodeCells.push({
        id: index,
        key: keysArr[index],
        value: sizeObj[keysArr[index]] === undefined ? '' : sizeObj[keysArr[index]],
        isCollapse: false,
      })
    }
    for (let index = 0; index < item.cellLgh; index++) {
      var key, rowKeys
      keysArr.forEach((value, i, array) => {
        key = array[numberTarget]
        rowKeys = rowKeysArr[rowKey]
      })
      item.cells.push({
        id: index,
        key: key,
        isArrows: false,
        isRelation: true,
        isCollapse: false,
        isDbCollapse:false,
        rowKey: rowKeys,
      })
      if (numberTarget === keysArr.length - 1) {
        numberTarget = 0
        rowKey++
      } else {
        numberTarget++
      }
    }
  })
  nextTick(() => {
    isShow.value = true
    setTimeout(() => {
      leftBlankH.value = topColumn.value.clientHeight
    }, 100)
  })
  console.log(rowTree.value)
}

// 轮询获取是否为未追踪状态
function getLocTracking() {
  const status = localStorage.getItem('trackingStatus')
  if (Boolean(status)) {
    if (cellRelation.value['1-1'].length <= 0) {
      cellRelation.value['1-1'].push('1-1')
      const data = {
        cellRelation: cellRelation.value,
        tracking: 0,
      }
      proxy.$axios.saveTaskDetail({ taskId: 1002, daTree: JSON.stringify(data) }).then((res) => {
        proxy.$axios.getTaskDetail({ taskId: 1002 }).then((res) => {
          console.log(res)
          postAll()
          isShow.value = false
          cellGroup.value = {}
          columnNum.value = 0
          localStorage.removeItem('trackingStatus')
        })
      })
    }
  }
}

onMounted(() => {
  postAll()
  timer.value = setInterval(() => {
    getLocTracking()
  }, 2000)
})
onUnmounted(() => {
  clearInterval(timer.value)
})
</script>
<style lang="scss" scoped>
.go_back_wrapper {
  height: calc(100% - 65px);
  padding: 0 20px;
  background: #fff;
  border-radius: 8px;
  margin: 0 8px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.07);
  text-align: center;
}

.select_wrapper {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  .element {
    &:nth-child(1) {
      margin-right: 100px;
    }
  }
}

.table_wrapper {
  display: inline-block;
  width: auto;
  max-width: 100%;
  height: calc(100% - 140px);
  overflow-y: auto;

  .table_info {
    border: 1px solid #333;
    .content {
      display: flex;
      .flex {
        width: calc(100% - 440px);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        overflow-x: auto;
      }

      .top-column {
        min-width: 40px;
        height: 320px;
        display: flex;
        :deep(.el-tree) {
          display: flex;
          .el-tree-node {
            width: 100%;
            display: flex;
          }
          .el-tree-node__content {
            height: 100%;
            flex-direction: column;
            .custom-tree-node {
              width: 40px;
              height: 100%;
              display: flex;
              align-items: center;
              flex-direction: column;
              .tree-label {
                display: inline-block;
                margin-top: 3px;
                writing-mode: vertical-rl;
              }
            }
          }
          .el-tree-node__children {
            display: flex;
            .el-tree-node__content {
              padding-top: 10px;
            }
          }
          .el-tree-node__expand-icon.expanded {
            transform: rotate(0deg);
          }
          .el-tree-node__expand-icon {
            transform: rotate(90deg);
          }
          .element-top-line {
            height: 18px;
            display: block;
            position: absolute;
            left: 50%;
            top: 11px;
            border-left: 1px dashed #dcdfe6;
          }
          .element-land-line {
            display: block;
            width: 100%;
            position: absolute;
            top: 11px;
            left: 0;
            border-top: 1px dashed #dcdfe6;
          }
        }
      }

      .mid_cell {
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;

        .cell-info {
          display: flex;

          .cell-item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 41px;
            min-width: 40px;
            border: 1px solid #333;
            border-right: none;
            background: rgb(213, 213, 213);
            font-size: 14px;
          }
        }

        .cell {
          width: 40px;
          height: 40px;
          border-left: 1px solid #bbc8d1;
          border-bottom: 1px solid #bbc8d1;
          display: flex;
          align-items: center;
          justify-content: center;

          .img_jiantou {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
  }
}

.w {
  .top-left-box {
    width: 440px;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: flex-end;

    .blank {
      width: 40px;
      border-right: 1px solid;
      border-left: 1px solid;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
  }

  .tree_box_info {
    display: flex;

    .num_box {
      width: 40px;
      display: flex;
      flex-wrap: wrap;

      .cell-item {
        width: 100%;
        height: 40px;
        border: 1px solid #333;
        background: rgb(213, 213, 213);
        color: #000;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: none;
      }
    }
  }

  .el-tree {
    width: 100%;
  }

  :deep(.el-tree-node__content) {
    height: 40px;
  }
}
.back-pic {
  width: 16px;
  height: 16px;
  /* margin-right: 5px; */
}
.element-after-line {
  flex: 1;
  border-left: 1px dashed #dcdfe6;
  margin: 10px 0;
}
:deep(.el-collapse-transition-enter-active),
:deep(.el-collapse-transition-leave-active) {
  transition: none;
}
</style>
