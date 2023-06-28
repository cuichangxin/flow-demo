<template>
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
                :expand-on-click-node="false"
                ref="elTreeTop"
              >
                <template #default="{ node, data }">
                  <span v-if="node.label !== ''" class="custom-tree-node" :style="{background: data.isRelation ? '#e46a64' : ''}">
                    <span class="element-top-line"></span>
                    <img v-if="data.children" class="back-pic" src="../assets/image/back-wenjianjia.png" />
                    <img style="margin: 0 0 5px 0" v-else class="back-pic" src="../assets/image/back-wenjian.png" />
                    <span class="tree-label">{{ node.label }}</span>
                    <span class="element-land-line"></span>
                    <span class="element-after-line"></span>
                  </span>
                </template>
              </el-tree>
            </div>
            <!-- 中间交集格子 -->
            <div class="mid_cell" :style="{ width: midWidth + 'px' }" v-for="(node, index) in cellList" :key="index">
              <div class="cell-info">
                <div
                  v-for="(d, i) in node.parentList"
                  :key="i"
                  class="cell-item"
                  :style="{
                    borderRight: i === node.parentList.length - 1 ? 'none' : '',
                    background: d.value == '' ? '#e46a64' : '',
                    borderLeftColor: i == 0 ? 'transparent' : '',
                  }"
                >
                  {{ d.value }}
                </div>
              </div>
              <div
                v-for="(item, idx) in node.data"
                :key="idx"
                class="cell"
                :style="{
                  background: item.isBackground ? '#e46a64' : '',
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
const cellList = ref([])

const changeRow = (val) => {
  postAll()
  isShow.value = false
}
const changeColumn = (val) => {
  postAll()
  isShow.value = false
}
const getRowInfo = () => {
  return new Promise((resolve, reject) => {
    Axios.get(`http://localhost:8080/mock/goBackData/rowel/${rowValue.value}.json`).then((res) => {
      rowTree.value = res.rowTree
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
    Axios.get(`http://localhost:8080/mock/goBackData/unite/${rowValue.value + columnValue.value}.json`).then((res) => {
      cellRelation.value = res.cellRelation
      cellList.value = res.data
      resolve('unite')
    })
  })
}
function postAll() {
  Promise.all([getRowInfo(), getColumnInfo(), getUnite()]).then((res) => {
    rowTree.value.forEach((item) => {
      if (item?.children) {
        deepTreeLink(item.children)
      }
    })
    initMatrix()
  })
}

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

// 初始化
const initMatrix = () => {
  // 顶部列个数
  let columnNum = 0
  // 顶部竖向展示的条数的key集合
  let keysArr = []
  const flatCell = Object.values(cellRelation.value).flat(Infinity)

  columnTree.value.forEach((column) => {
    if (column?.children) {
      columnNum += column.children.length
      // TODO: 目前先计算一层，后面需要根据树折叠展开动态计算
      column.children.forEach((child) => {
        if (!keysArr.includes(child.key)) {
          keysArr.push(child.key)
        }
        if (!flatCell.includes(child.key)) {
          child.isRelation = true
        }
      })
    }
  })
  // 动态计算中间格子集合的宽度， 单个格子宽度40
  midWidth.value = columnNum * 40
  nextTick(() => {
    isShow.value = true
    setTimeout(() => {
      leftBlankH.value = topColumn.value.clientHeight
    }, 100)
  })
  console.log(rowTree.value)
}

onMounted(() => {
  postAll()
  windowH.value = window.innerHeight - 124
  window.addEventListener('resize', () => {
    windowH.value = window.innerHeight - 124
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>
<style lang="scss" scoped>
.go_back_wrapper {
  padding: 0 20px;
  background: #fff;
  border-radius: 8px;
  margin: 0 8px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.07);
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
            .el-tree-node__content {
              position: relative;

              .custom-tree-node {
                display: flex;
                align-items: center;
                flex: 1;

                .element-land-line {
                  flex: 1;
                  border-top: 1px dashed #dcdfe6;
                  margin: 0 20px 0 4px;
                }

                .tree-label {
                  white-space: nowrap;
                }
              }
            }

            .el-tree-node__children {
              display: flex;
              height: calc(100% - 40px);
              overflow: visible;
              .el-tree-node {
                width: 40px;
                border-left: 1px solid transparent;
              }

              .el-tree-node__content {
                height: 100%;
                flex-direction: column;
                .el-tree-node__expand-icon.is-leaf {
                  display: none;
                }
              }

              .custom-tree-node {
                width: 40px;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
                position: relative;

                .tree-label {
                  display: flex;
                  align-items: center;
                  width: 20px;
                  min-height: 100px;
                  color: #333;
                  text-align: center;
                  white-space: pre-line;
                  writing-mode: vertical-rl;
                }
                
                .element-top-line {
                  height: 10px;
                  display: block;
                  border-left: 1px solid #dcdfe6;
                  position: absolute;
                  top: 0px;
                }
                .element-land-line {
                  display: block;
                  height: 20px;
                  flex: none;
                  border-top: none;
                  margin: 0;
                  border-left: 1px dashed #dcdfe6;
                  position: absolute;
                  top: -20px;
                }
                .element-after-line {
                  flex: 1;
                  border-left: 1px dashed #dcdfe6;
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
