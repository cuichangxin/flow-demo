<template>
  <el-container class="container">
    <el-main class="main">
      <div class="go_back_wrapper" :style="{ height: `${windowH}px` }">
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
                  >
                    <template v-slot:default="{ node, data }">
                      <element-tree-line
                        :node="node"
                        :showLabelLine="true"
                        :style="{ background: data.linkNum === 0 && data.key.indexOf('-') !== -1 ? '#e46a64' : '' }"
                      >
                        <template v-slot:node-label>
                          <img v-if="data.children" class="back-pic" src="../assets/image/back-wenjianjia.png" />
                          <img v-else class="back-pic" src="../assets/image/back-wenjian.png" />
                          <span>{{ node.label }}</span>
                        </template>
                        <template v-slot:after-node-label>
                          <div class="num_box">
                            <div class="cell-item">{{ data.linkNum === 0 ? '' : data.linkNum }}</div>
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
                    :expand-on-click-node="false"
                    ref="elTreeTop"
                    :render-content="renderContent"
                  >
                    <template #default="{ node, data }">
                      <span>
                        <img v-if="data.children" class="back-pic" src="../assets/image/back-wenjianjia.png" />
                        <img v-else class="back-pic" src="../assets/image/back-wenjian.png" />
                        <span>{{ node.label }}</span>
                      </span>
                    </template>
                  </el-tree>
                </div>
                <!-- 中间交集格子 -->
                <div class="mid_cell" :style="{ width: midWidth + 'px' }" v-for="(node, idx) in rowTree" :key="idx">
                  <div class="cell-info">
                    <div
                      v-for="(d, i) in node.parentList"
                      :key="i"
                      class="cell-item"
                      :style="{
                        borderRight: i === node.parentList.length - 1 ? 'none' : '',
                        background: d.value == '' && d.key.indexOf('-') === -1 ? '#e46a64' : '',
                        borderLeftColor: i == 0 ? 'transparent' : '',
                      }"
                    >
                      {{ d.value }}
                    </div>
                  </div>
                  <div
                    v-for="item in node.cellList"
                    :key="item.id"
                    class="cell"
                    :style="{
                      background: item.bgTarget ? '#e46a64' : '',
                    }"
                  >
                    <img
                      v-if="item.isArrows"
                      class="img_jiantou"
                      src="../assets/image/jiantou.png"
                      :style="{ transform: rowValue == 'software' && columnValue == 'need' ? 'rotate(225deg)' : '' }"
                    />
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script setup>
import _ from 'lodash'
import Axios from 'axios'

const treeProps = {
  indent: 16,
  showLabelLine: true,
}
const windowH = ref('')
const rowValue = ref('software')
const columnValue = ref('need')
const lastChild = ref('')
const leftBlankH = ref('')
const cellNumList = ref([])
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
const columns = ref(0)
const midWidth = ref('') // 中间格子集合宽度
const rowColumns = ref({})
const nameInfo = ref([])
const cellRelation = ref({}) // 中间格子交集数据
const isShow = ref(false)
const topColumn = ref(null)

const changeRow = (val) => {
  postAll()
  isShow.value = false
  rowColumns.value = {}
  cellNumList.value = []
  nameInfo.value = []
}
const changeColumn = (val) => {
  postAll()
  isShow.value = false
  rowColumns.value = {}
  cellNumList.value = []
  nameInfo.value = []
}

/**
 * @description 按照长度分割数组
 * @param arr 要切割的数组
 * @param len 要切割的数组长度
 * @param key 标识
 */
function subGroup(arr, len, key) {
  var newArr = {}
  var keys = parseInt(key.split('-')[key.split('-').length - 1])
  newArr[key] = new Array(1)
  for (var i = 0; i < arr.length; i += len) {
    newArr[key].push(arr.slice(i, i + len))
  }
  newArr[key].forEach(() => {
    rowColumns.value[key] = newArr[key][keys]
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
// 计算左行的顶级父元素下的所有子级个数，并且写入到row树中
function computeCell(num, key) {
  // 顶部列个数
  let columnNum = 0
  // 全部的格子数量
  let totalCell = 0,
    // 全部格子数组集合
    totalCellArr = [],
    // 顶部竖向展示的条数的key集合
    keysArr = [],
    // key索引
    keysNum = 0,
    // 左侧行最外层格子
    parentArr = []

  columnTree.value.forEach((column) => {
    if (column?.children) {
      columnNum += column.children.length
      // TODO: 目前先计算一层，后面需要根据树折叠展开动态计算
      column.children.forEach((child) => {
        if (!keysArr.includes(child.key)) {
          keysArr.push(child.key)
        }
      })
    }
  })
  columns.value = columnNum
  // 动态计算中间格子集合的宽度， 单个格子宽度40
  midWidth.value = columnNum * 40

  totalCell = num * columnNum

  for (var index = 0; index < totalCell; index++) {
    totalCellArr.push({
      id: index,
      isArrows: false,
      isBorder: true,
    })
  }

  totalCellArr.map((cell) => {
    keysArr.forEach((item, index, array) => {
      // 把顶部垂直展示的条目的key顺序写入
      cell.key = array[keysNum]
    })
    if (keysNum === keysArr.length - 1) {
      keysNum = 0
    } else {
      keysNum++
    }
  })

  for (let i = 0; i < columnNum; i++) {
    parentArr.push({
      id: i,
      value: '',
      key: keysArr[i],
    })
  }
  rowTree.value.forEach((item) => {
    if (item.key === key) {
      item.cellList = totalCellArr
      item.parentList = parentArr
    }
  })
}
function renderContentMidden() {
  rowTree.value.forEach((item) => {
    computeCell(item.cellTotal, item.key)
  })
}

const renderContent = (h, { node, data }) => {
  return h(
    'span',
    {
      class: data.bgTarget && node.childNodes.length <= 0 ? 'custom-tree-node no_bg' : 'custom-tree-node',
    },
    h('i', { class: node.childNodes.length ? 'iconfont icon-wenjianjia1' : 'iconfont icon-wenjian' }),
    h('span', { class: 'tree-label' }, node.label),
    node.label ? h('span', { class: 'element-land-line' }) : '',
    h('span', { class: 'element-after-line' })
  )
}
const getRowInfo = () => {
  return new Promise((resolve, reject) => {
    Axios.get(`http://localhost:8080/mock/goBackData/rowel/${rowValue.value}.json`).then((res) => {
      rowTree.value = res.rowTree
      rowTree.value.map((item, index) => {
        item.cellTotal = 0
        treeLength(rowTree.value, index)
      })
      function treeLength(tree, index) {
        tree.forEach((item, idx) => {
          if (idx === index) {
            if (item.children && item.children.length) {
              rowTree.value[index].cellTotal += item.children.length
              console.log(item.children.length, rowTree.value[index].cellTotal)
              treeLength(item.children, index)
            }
          }
        })
      }
      resolve('row')
    })
  })
}
function getColumnInfo() {
  return new Promise((resolve, reject) => {
    Axios.get(`http://localhost:8080/mock/goBackData/columnel/${columnValue.value}.json`).then((res) => {
      columnTree.value = res.columnTree
      resolve('column')
    })
  })
}
function getUnite() {
  return new Promise((resolve, reject) => {
    Axios.get(`http://localhost:8080/mock/goBackData/unite/${rowValue.value + columnValue.value}.json`).then(
      (res) => {
        cellRelation.value = res.cellRelation
        resolve('unite')
      }
    )
  })
}
function postAll() {
  Promise.all([getRowInfo(), getColumnInfo(), getUnite()]).then((res) => {
    renderContentMidden()
    initMatrix()
  })
}
// 初始化
const initMatrix = () => {
  let columnObj = {} // 记录竖向交集
  let relationGroup = {} // 处理交集数据
  let idx = 0 // 循环次数
  let sizeBox = {} // 列灰色格子交集数量
  let allUnite = [] // 所有交集数据
  nextTick(() => {
    rowTree.value.forEach((item, index) => {
      idx = index
      relationGroup[item.name] = []
      nameInfo.value.push(item.name)
      // item.cellNum = ''

      Object.keys(cellRelation.value[item.name]).forEach((re) => {
        if (idx <= index) {
          relationGroup[item.name].push(cellRelation.value[item.name][re])
          relationGroup[item.name] = relationGroup[item.name].flat(Infinity)
          sizeBox[item.name] = keysSize(relationGroup[item.name])
        }
      })

      cellNumList.value.push(item.cellNum)
      if (item?.children) {
        item.children.forEach((child, idx) => {
          // Object.keys(cellRelation.value[item.name]).forEach((re) => {
          //   if (child.key == re) {
          //     child.cellNum = cellRelation.value[item.name][child.key].length // 左侧竖向灰色格子显示数字
          //     cellNumList.value.push(child.cellNum)
          //   }
          // })
          // 行没有交集时背景色显示红色
          if (child.cellNum == 0) {
            let size = idx + 1,
              end = size * columns.value,
              start = end - columns.value
            item.cellList.forEach((cell, j) => {
              if (j >= start && j < end) {
                cell.bgTarget = true
              }
            })
          }
          columnObj[child.key] = cellRelation.value[item.name][child.key]

          subGroup(item.cellList, columns.value, child.key)

          // 中间格子箭头标记
          rowColumns.value[child.key].map((rc) => {
            cellRelation.value[item.name][child.key].forEach((cc) => {
              if (rc.key == cc) {
                rc.isArrows = true
              }
            })
          })
          if (index == rowTree.value.length - 1 && idx == item.children.length - 1) {
            lastChild.value = child.key
          }
        })
      }

      item.cellList.forEach((cell, cellIndex) => {
        item.parentList.forEach((par, parIndex) => {
          Object.keys(sizeBox[item.name]).forEach((k) => {
            if (par.key == k) {
              par.value = sizeBox[item.name][k]
            }
          })
          // 中间格子列没有交集背景色显示红色
          if (par.value == '') {
            if (cellIndex - parIndex == columns.value) {
              cell.bgTarget = true
            }
            if (cellIndex == parIndex) {
              cell.bgTarget = true
            }
            if ((cellIndex - parIndex) % columns.value == 0) {
              cell.bgTarget = true
            }
          }
        })
      })
    })

    nameInfo.value.forEach((item, index) => {
      allUnite.push(Object.keys(sizeBox[item]))
    })
    allUnite = allUnite.flat(Infinity)
    columnTree.value.forEach((item, index) => {
      if (item?.children) {
        item.children.forEach((child) => {
          if (!allUnite.includes(child.key)) {
            child.bgTarget = true
          }
        })
      }
    })
  })
  nextTick(() => {
    if (idx == rowTree.value.length - 1) {
      isShow.value = true
      // nextTick(() => {
      //   leftBlankH.value = topColumn.value.clientHeight
      //   console.log(leftBlankH.value)
      // })
      setTimeout(() => {
        leftBlankH.value = topColumn.value.clientHeight
      }, 100)
    }
  })
  console.log(rowTree.value)
}

onMounted(() => {
  postAll()
  windowH.value = window.innerHeight - 160
  window.addEventListener('resize', () => {
    windowH.value = window.innerHeight - 160
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: center;
  padding-top: 0;
}

.go_back_wrapper {
  width: 100%;
  padding: 0 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgb(216, 213, 213);
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
        display: flex;

        .el-tree {
          display: flex;

          :deep(.el-tree-node) {
            position: relative;
            width: 100%;
            white-space: pre-line;

            .el-tree-node__expand-icon {
              display: none;
            }

            .icon-wenjianjia1 {
              color: #f7c53c;
              padding-right: 3px;
              padding-left: 10px;
              position: relative;
              z-index: 9;
            }

            .el-tree-node__content {
              position: relative;

              .custom-tree-node {
                display: flex;
                align-items: center;
                flex: 1;

                .element-land-line {
                  flex: 1;
                  border-top: 1px dashed #9a9a9d;
                  margin: 0 20px 0 4px;
                }

                .tree-label {
                  white-space: nowrap;
                }
              }

              .no_bg {
                background: #e46a64;
              }
            }

            .el-tree-node__children {
              display: flex;
              height: calc(100% - 40px);

              .el-tree-node {
                width: 40px;
                border-left: 1px solid transparent;
              }

              .el-tree-node__content {
                height: 100%;
              }

              .custom-tree-node {
                width: 40px;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;

                .tree-label {
                  display: flex;
                  align-items: center;
                  width: 20px;
                  min-height: 100px;
                  color: #333;
                  text-align: center;
                  white-space: pre-line;
                  writing-mode: vertical-rl;

                  .icon-wenjian {
                    padding-bottom: 10px;
                  }
                }

                .element-land-line {
                  display: block;
                  height: 20px;
                  flex: none;
                  border-top: none;
                  margin: 0;
                  border-left: 1px dashed #9a9a9d;
                  position: absolute;
                  top: -20px;
                }

                .element-after-line {
                  flex: 1;
                  border-left: 1px dashed #9a9a9d;
                  margin: 10px 0;
                }
              }
            }
          }

          :deep(.el-tree-node__content) {
            width: 100%;
            height: 40px;
            display: flex;
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
            width: 18px;
            height: 18px;
            transform: rotate(45deg);
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
        font-size: 15px;
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
  margin-right: 5px;
}
</style>
