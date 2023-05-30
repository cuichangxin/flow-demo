<template>
  <el-container class="container">
    <el-main class="main">
      <div class="go_back_wrapper" :style="{ height: `${windowH}px` }">
        <div class="select_wrapper">
          <div class="element">
            <label>行元素类型：</label>
            <el-select v-model="rowValue" placeholder="请选择" @change="row">
              <el-option v-for="item in rowSelectList" :key="item.label" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </div>
          <div class="element">
            <label>列元素类型：</label>
            <el-select v-model="columnValue" placeholder="请选择" @change="column">
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
                  <el-tree v-if="isShow" :data="rowTree" node-key="key" :indent="treeProps.indent" default-expand-all
                    :expand-on-click-node="false" :render-content="renderContentRow">
                  </el-tree>

                  <div class="num_box">
                    <div v-for="(item, index) in cellNumList" :key="index"
                      :style="{ background: item === 0 ? '#e46a64' : '' }" class="cell-item">{{ item == 0 ? '' : item }}
                    </div>
                  </div>
                </div>
              </div>

              <el-scrollbar class="flex">
                <!-- 顶部列 -->
                <div class="top-column" ref="topColumn">
                  <el-tree v-if="isShow" :data="columnTree" node-key="key" :indent="0" default-expand-all
                    :expand-on-click-node="false" ref="elTreeTop" :render-content="renderContent">
                  </el-tree>
                </div>
                <!-- 中间交集格子 -->
                <div class="mid_cell" :style="{ width: midWidth + 'px' }" v-for="(node, idx) in rowTree" :key="idx">
                  <div class="cell-info">
                    <div v-for="(d, i) in node.parentList" :key="i" class="cell-item" :style="{
                      borderRight: i === node.parentList.length - 1 ? 'none' : '',
                      background: d.value == '' ? '#e46a64' : '',
                      borderLeftColor: i == 0 ? 'transparent' : ''
                    }">{{ d.value }}</div>
                  </div>
                  <div v-for="item in node.cellList" :key="item.id" class="cell" :style="{
                    borderBottom: item.isBorder ? '' : 'none',
                    background: item.bgTarget ? '#e46a64' : '',
                  }">
                    <img v-if="item.isArrows" class="img_jiantou" src="../assets/image/jiantou.png"
                      :style="{ transform: rowValue == 'software' && columnValue == 'need' ? 'rotate(225deg)' : '' }" />
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
import _ from "lodash";
import Axios from 'axios'
import { nextTick, onUnmounted } from "vue";
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
    value: "software",
    label: "软件架构",
  },
  {
    value: "testCase",
    label: "测试用例",
  },
])
const columnSelectList = reactive([
  {
    value: "need",
    label: "软件需求",
  },
  {
    value: "testCase",
    label: "测试用例",
  },
])
const rowTree = ref([])
const columnTree = ref([])
const columns = ref(0)
const midWidth = ref('')
const rowcolumns = ref({})
const nameInfo = ref([])
const cellRelation = ref({}) // 中间格子交集数据
const isShow = ref(false)
const topColumn = ref(null)

const row = (val) => {
  postAll()
  isShow.value = false
  rowcolumns.value = {}
  cellNumList.value = []
  nameInfo.value = []
}
const column = (val) => {
  postAll()
  isShow.value = false
  rowcolumns.value = {}
  cellNumList.value = []
  nameInfo.value = []
}
const cellNum = (val, key) => {
  let columnNum = 0
  let add
  let res = [];
  let parentRes = []
  let childArr = []
  let num = 0
  columnTree.value.forEach((column) => {
    if (column?.children) {
      columnNum += column.children.length
      column.children.forEach((child) => {
        if (!childArr.includes(child.key)) {
          childArr.push(child.key)
        }
      })
    }
  });
  add = _.add(val) * columnNum
  for (let i = 0; i < add; i++) {
    res.push({
      id: i,
      isArrows: false,
      isBorder: true,
    });
  }
  let rev = res.reverse()
  rev.forEach((v, i) => {
    if (i < columns.value) {
      v.isBorder = false
    }
  })

  for (let i = 0; i < columnNum; i++) {
    parentRes.push({
      id: i,
      value: ''
    });
  }

  parentRes.forEach((item, index) => {
    item.key = childArr[index]
  })

  // 计算列每条数据出现的次数
  rowTree.value.forEach((item) => {
    if (item.key === key) {
      item.cellList = rev.reverse()
      item.parentList = parentRes
      item.cellList.forEach(cell => {
        childArr.forEach((value, index, array) => {
          cell.key = array[num]
        })
        if (num === childArr.length - 1) {
          num = 0
        } else {
          num++
        }
      })
    }
  })
}
/**
 * @description 按照长度分割数组
 * @param {arr} 要切割的数组
 * @param {len} 要切割的数组长度
 * @param {key} 标识
*/
const subGroup = (arr, len, key) => {
  var newArr = {}
  var keys = parseInt(key.split('-')[key.split('-').length - 1])
  newArr[key] = new Array(1)
  for (var i = 0; i < arr.length; i += len) {
    newArr[key].push(arr.slice(i, i + len))
  }
  newArr[key].forEach(() => {
    rowcolumns.value[key] = newArr[key][keys]
  })
}
const keysSize = (arr) => {
  return arr.reduce((obj, key) => {
    if (key in obj) {
      obj[key]++
    } else {
      obj[key] = 1
    }
    return obj
  }, {})
}
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
      item.cellNum = ''

      Object.keys(cellRelation.value[item.name]).forEach(re => {
        if (idx <= index) {
          relationGroup[item.name].push(cellRelation.value[item.name][re])
          relationGroup[item.name] = relationGroup[item.name].flat(Infinity)
          sizeBox[item.name] = keysSize(relationGroup[item.name])
        }
      })

      cellNumList.value.push(item.cellNum)
      if (item?.children) {
        item.children.forEach((child, idx) => {
          Object.keys(cellRelation.value[item.name]).forEach(re => {
            if (child.key == re) {
              child.cellNum = cellRelation.value[item.name][child.key].length // 左侧竖向灰色格子显示数字
              cellNumList.value.push(child.cellNum)
            }
          })
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
          rowcolumns.value[child.key].map(rc => {
            cellRelation.value[item.name][child.key].forEach(cc => {
              if (rc.key == cc) { rc.isArrows = true }
            })
          })
          if (index == (rowTree.value.length - 1) && idx == (item.children.length - 1)) {
            lastChild.value = child.key
          }

        })
      }

      item.cellList.forEach((cell, cellIndex) => {
        item.parentList.forEach((par, parIndex) => {
          Object.keys(sizeBox[item.name]).forEach(k => {
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
        item.children.forEach(child => {
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
        console.log(topColumn.value.clientHeight)
        leftBlankH.value = topColumn.value.clientHeight
      }, 100)
    }
  })
}
const midW = () => {
  let columnNum = 0
  columnTree.value.forEach((column) => {
    if (column?.children) { columnNum += column.children.length }
  });
  columns.value = columnNum
  midWidth.value = columnNum * 40
  rowTree.value.forEach(item => {
    if (item?.children) {
      cellNum(item.children.length, item.key)
    }
  })
}
const renderContent = (h, { node, data }) => {
  return h(
    'span',
    {
      class: data.bgTarget && node.childNodes.length <= 0 ? 'custom-tree-node no_bg' : 'custom-tree-node'
    },
    h('i', { class: node.childNodes.length ? 'iconfont icon-wenjianjia1' : 'iconfont icon-wenjian' }),
    h('span', { class: 'tree-label' }, node.label),
    node.label ? h('span', { class: 'element-land-line' }) : '',
    h('span', { class: 'element-after-line' }),
  )
}
const renderContentRow = (h, { node, data }) => {
  return h(
    'span',
    {
      class: data.cellNum <= 0 && node.childNodes.length <= 0 ? 'custom-tree-node no_bg' : 'custom-tree-node'
    },
    h('i', { class: node.childNodes.length ? 'iconfont icon-wenjianjia1' : 'iconfont icon-wenjian' }),
    h('span', { class: 'tree-label' }, node.label),
    h('span', { class: 'element-title-line' }),
    h('span', { class: 'element-land-line' }),
    h('span', { class: 'element-after-line' }),
  )
}
const getRowInfo = () => {
  return new Promise((resolve, reject) => {
    Axios.get(`./mock/goBackData/rowel/${rowValue.value}.json`).then((res) => {
      rowTree.value = res.rowTree
      resolve('row')
    })
  })
}
const getColumnInfo = () => {
  return new Promise((resolve, reject) => {
    Axios.get(`./mock/goBackData/columnel/${columnValue.value}.json`).then((res) => {
      columnTree.value = res.columnTree
      resolve('column')
    })
  })
}
const getUnite = () => {
  return new Promise((resolve, reject) => {
    Axios.get(`./mock/goBackData/unite/${rowValue.value + columnValue.value}.json`).then((res) => {
      cellRelation.value = res.cellRelation
      resolve('unite')
    })
  })
}
const postAll = () => {
  Promise.all([getRowInfo(), getColumnInfo(), getUnite()]).then((res) => {
    midW()
    initMatrix()
  })
}

onMounted(() => {
  postAll()
  windowH.value = window.innerHeight - 160
  window.addEventListener('resize', () => {
    windowH.value = window.innerHeight - 160
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => { })
})
</script>
<style lang="scss" scoped>
.container {
  /* height: 100%; */
}

.main {
  /* height: 100%; */
  display: flex;
  justify-content: center;
  padding-top: 0;
}

.go_back_wrapper {
  /* max-height: 800px; */
  width: 100%;
  padding: 0 50px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid rgb(216, 213, 213);

  .select_wrapper {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    .element {
      label {
        font-size: 15px;
      }

      &:nth-child(1) {
        margin-right: 100px;
      }

      :deep(.el-select) {
        width: 280px;
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
                display: flex;
                align-items: center;
                justify-content: center;
                border-top: none;

                &:last-child {
                  border-bottom: none;
                }
              }
            }
          }

          .el-tree {
            width: calc(100% - 40px);
          }

          :deep(.el-tree-node) {
            position: relative;

            .el-tree-node__expand-icon {
              display: none;
            }

            .el-tree-node__content {
              position: relative;
              height: 40px;

              .custom-tree-node {
                display: flex;
                align-items: center;
                flex: 1;
                position: relative;

                .element-land-line {
                  flex: 1;
                  border-top: 1px dashed #9a9a9d;
                  margin: 0 10px 0 8px;
                }

                .tree-label {
                  white-space: nowrap;
                }

                .icon-wenjianjia1 {
                  color: #f7c53c;
                  padding-left: 12px;
                  padding-right: 6px;
                }

                .icon-wenjian {
                  padding-left: 25px;
                }
              }

              .no_bg {
                background: #e46a64;
              }
            }

            .el-tree-node__children {
              overflow: visible;

              .el-tree-node__content {
                height: 40px;
              }

              .custom-tree-node {
                position: relative;
                display: flex;
                align-items: center;
                flex: 1;
                height: 100%;

                .tree-label {
                  display: flex;
                  align-items: center;
                  color: #333;
                }

                .element-title-line {
                  display: block;
                  border-left: 1px dashed #9a9a9d;
                  height: 100%;
                  position: absolute;
                  left: 0;
                  top: 0;
                }

                .element-after-line {
                  border-top: 1px dashed #9a9a9d;
                  width: 15px;
                  position: absolute;
                  left: 3px;
                }

                .last-element-title-line {
                  height: 50%;
                }
              }
            }
          }
        }

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
                overflow: visible;

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
}
</style>