<template>
  <div v-show="!viewFlag" class="task_info">
    <div class="top_task">
      <div class="top_title">任务名称</div>
      <div class="task_wrapper">
        <ul>
          <li
            v-for="(item, index) in taskList"
            :key="index"
            :style="{ background: tabIndex == index ? 'var(--color-active)' : '' }"
            @click="checkTask(index)"
          >
            <i class="iconfont icon">&#xec35;</i>
            <span>{{ item.data.label }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="table">
      <div class="issue">
        <div class="top_info">
          <div class="flex">
            <i class="iconfont icon">&#xe632;</i>
            <span>发布数据</span>
          </div>
          <div class="top_add">
            <i class="iconfont icon" @click="addCode('issueTableData')">&#xe683;</i>
          </div>
        </div>
        <div class="table_wrapper">
          <el-table
            :data="issueTableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
            border
            :header-cell-style="tableHeaderCellStyle"
          >
            <el-table-column align="center" label="序号" width="100">
              <template #default="scope">
                {{ scope.$index + (currentPage - 1) * pagesize + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="codeName" label="变量名称"> </el-table-column>
            <el-table-column align="center" prop="type" label="数据类型"> </el-table-column>
            <el-table-column align="center" prop="desc" label="描述"> </el-table-column>
            <el-table-column align="center" label="操作" width="120">
              <template #default="scope">
                <div class="butn">
                  <el-button link @click="remove(scope.row, 'issueTableData')">
                    <i class="iconfont icon">&#xe68e;</i>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="issueTableData.length"
              :page-size="pagesize"
              :current-page="currentPage"
              @current-change="handlerCurrentChange"
              @size-change="handleSizeChange"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="take">
        <div class="top_info">
          <div class="flex">
            <i class="iconfont icon">&#xe600;</i>
            <span>订阅数据</span>
            <i v-if="!suggest" class="iconfont icon-jiqiren_o" @click="openSuggest(scope)"></i>
          </div>
          <div class="top_add">
            <i class="iconfont icon" @click="addCode('takeTableData')">&#xe683;</i>
          </div>
        </div>
        <div class="table_wrapper">
          <el-table
            :data="takeTableData.slice((takeCurrentPage - 1) * takePagesize, takeCurrentPage * takePagesize)"
            border
            :header-cell-style="tableHeaderCellStyle"
          >
            <el-table-column align="center" label="序号" width="100">
              <template #default="scope">
                {{ scope.$index + (takeCurrentPage - 1) * takePagesize + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="codeName" label="变量名称"> </el-table-column>
            <el-table-column align="center" prop="type" label="数据类型"> </el-table-column>
            <el-table-column align="center" prop="desc" label="描述"> </el-table-column>
            <el-table-column align="center" label="操作" width="120">
              <template #default="scope">
                <div class="butn">
                  <el-button link @click="remove(scope.row, 'takeTableData')">
                    <i class="iconfont icon">&#xe68e;</i>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="takeTableData.length"
              :page-size="takePagesize"
              :current-page="takeCurrentPage"
              @current-change="takeHandlerCurrentChange"
              @size-change="takeHandleSizeChange"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- 抽屉表单 -->
    <el-drawer :title="typeName == 'issueTableData' ? '新增发布数据' : '新增订阅数据'" v-model="drawer">
      <div class="form_box">
        <el-form
          :ref="(el) => (formRef = el)"
          :model="form"
          :rules="rules"
          :hide-required-asterisk="true"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="变量名称" prop="codeName">
            <el-input v-model="form.codeName"></el-input>
          </el-form-item>
          <el-form-item label="数据类型" prop="type">
            <el-input v-model="form.type"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="form.desc" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确 定</el-button>
            <el-button @click="drawerOff">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
  <div v-show="viewFlag" class="view_wrapper">
    <div id="graphs" class="canvas" ref="graphRef">
      <div id="graph-containers" class="graph-container"></div>
    </div>
  </div>
  <Dialog
    title="智能辅助"
    :hidden-full-btn="false"
    :width="'50%'"
    v-model="visible"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="建议" name="suggest">
        <ul class="suggest_ul">
          <li>
            <!-- <img src="../../../assets/image/shengdantubiao-05.png" alt="" /> -->
            <p>针对遥控功能的订阅数据，为您搜索到以下建议:</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;建议增加惯性坐标系位置信息和视速度</p>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="历史案例" name="case">
        <el-tabs v-model="caseName">
          <el-tab-pane label="xxx案例" name="langFive">
            <ul class="suggest_ul">
              <li>
                <!-- <img src="../../../assets/image/shengdantubiao-05.png" alt="" /> -->
                该案例下订阅数据有惯性坐标系位置信息和视速度
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="xxx案例" name="langSix"></el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </Dialog>
</template>
<script setup>
import { workStore } from '@/store/index'
import { storeToRefs } from 'pinia'

import { Graph, Shape } from '@antv/x6'
import insertCss from 'insert-css'
import Dialog from '@/components/common/dialog/dialog.vue'
import useDialog from '@/hooks/useDialog'
import useDark from '@/hooks/useDark'

const { visible: visible, openDialog: openDialog, closeDialog: closeDialog } = useDialog()
const { match, localMatch } = useDark()

const { proxy } = getCurrentInstance()
proxy.$bus.on('*', (name, val) => {
  if (name === 'taskRelationship') {
    console.log(name, val)
    const data = val.filter((item) => {
      if (!item.store.data.myTarget) {
        return item.store.data
      }
    })
    data.forEach((item, index) => {
      // TODO: 赋值不对
      // if (item.store.data.data.label.indexOf('姿控功能') !== -1) {
      //   tabIndex.value = index
      // }
      if (item === undefined) {
        data.splice(index, 1)
      }
    })
    // data.splice(0, 1)
    taskList.value = data
  }
  if (name === 'changeView') {
    viewFlag.value = val
  }
  if (name === 'isDark') {
    if (graph !== null) {
      if (val) {
        changeDarkModeX6('#A9A9AD', '#C7C8CC')
      } else {
        changeDarkModeX6('#aaa', '#333')
      }
    }
  }
})
const activeName = ref('suggest')
const caseName = ref('langFive')
const suggest = ref(true)
const work = workStore()
const { taskAllList } = storeToRefs(work)
const taskList = ref([])
const viewFlag = ref(false)

const issueTableData = ref([])
const takeTableData = ref([])
const currentPage = ref(1)
const pagesize = ref(6)
const takeCurrentPage = ref(1)
const takePagesize = ref(6)
const tabIndex = ref(1)
const drawer = ref(false)
const form = ref({
  codeName: '',
  type: '',
  desc: '',
})
const typeName = ref('')
const formRef = ref(null)
const rules = reactive({
  codeName: [{ required: true, message: '请输入变量名称', trigger: 'blur' }],
  type: [{ required: true, message: '请输入数据类型', trigger: 'blur' }],
  desc: [{ required: true, message: '请输入描述', trigger: 'blur' }],
})
let graph = null
const graphData = ref({})
const taskRelationData = ref({})

watch(tabIndex, (n) => {
  if (Object.prototype.hasOwnProperty.call(taskRelationData.value, n)) {
    issueTableData.value = taskRelationData.value[n].issueTableData
    takeTableData.value = taskRelationData.value[n].takeTableData
  } else {
    issueTableData.value = []
    takeTableData.value = []
  }
})
watch(viewFlag, (n) => {
  if (n) {
    if (Object.keys(graphData.value).length <= 0) {
      proxy.$axios.getTaskDetail({ taskId: 2006 }).then((res) => {
        graphData.value = JSON.parse(res.data.daTree)
        createGraphic()
        if (match || localMatch === 'dark') {
          changeDarkModeX6('#A9A9AD', '#C7C8CC')
        }
      })
    }
  }
})
// 适配暗黑模式
const changeDarkModeX6 = (color, edgeColor) => {
  const edges = graph.getEdges()
  graph.drawGrid({
    type: 'dot',
    args: [
      {
        color: color,
        thickness: 1,
      },
    ],
  })
  edges.forEach((edge) => {
    edge.attr({
      line: {
        stroke: edgeColor,
      },
    })
  })
}
const openSuggest = (scope) => {
  openDialog()
}
const handleConfirm = () => {
  closeDialog()
}
const handleClose = () => {
  closeDialog()
}
// 初始化创建画布
const createGraphic = () => {
  // #region 构建自定义图形
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
    },
    true
  )
  // #endregion
  const parentDom = document.getElementById('graphs')
  const graphDom = document.getElementById('graph-containers')
  graph = new Graph({
    container: graphDom,
    width: parentDom.clientWidth,
    height: parentDom.clientHeight,
    grid: true,
    panning: {
      enabled: true, // 开启拖拽平移
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
              stroke: '#333',
              strokeWidth: 1,
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
  })
  insertCss(`
    #container {
      display: flex;
    }
    #graph-container {
      width: calc(100% - 180px);
      height: 100%;
    }
  `)

  if (Object.keys(graphData.value).length) {
    graph.fromJSON(graphData.value.cells)
    graph.centerContent()
  }
}

const tableHeaderCellStyle = () => {
  return {
    background: 'var(--my-bg-color-7)',
  }
}
const handlerCurrentChange = (val) => {
  currentPage.value = val
}
const handleSizeChange = () => {
  currentPage.value = 1
}
const takeHandlerCurrentChange = (val) => {
  takeCurrentPage.value = val
}
const takeHandleSizeChange = () => {
  takeCurrentPage.value = 1
}
const checkTask = (index) => {
  tabIndex.value = index
}
const remove = (row, name) => {
  let mixObj = {}
  if (name === 'issueTableData') {
    let index = issueTableData.value.indexOf(row)
    issueTableData.value.splice(index, 1)
  } else {
    let index = takeTableData.value.indexOf(row)
    takeTableData.value.splice(index, 1)
  }
  mixObj.issueTableData = issueTableData.value
  mixObj.takeTableData = takeTableData.value
  work.setTaskAllData([mixObj, tabIndex.value])
  localStorage.setItem('relationData', JSON.stringify(taskAllList.value))
}
const addCode = (name) => {
  typeName.value = name
  drawer.value = true
}
const onSubmit = async () => {
  await formRef.value.validate((val) => {
    if (val) {
      let mixObj = {}
      if (typeName.value === 'issueTableData') {
        issueTableData.value.push(form.value)
      } else {
        takeTableData.value.push(form.value)
      }
      form.value = {
        codeName: '',
        type: '',
        desc: '',
      }
      mixObj.issueTableData = issueTableData.value
      mixObj.takeTableData = takeTableData.value
      work.setTaskAllData([mixObj, tabIndex.value])
      drawer.value = false
      localStorage.setItem('relationData', JSON.stringify(taskAllList.value))
    } else {
      return false
    }
  })
}
const drawerOff = () => {
  form.value = {
    codeName: '',
    type: '',
    desc: '',
  }
  drawer.value = false
}
const getRelation = () => {
  proxy.$axios.getTaskDetail({ taskId: 2007 }).then((res) => {
    taskRelationData.value = JSON.parse(res.data.daTree)
    issueTableData.value = taskRelationData.value[tabIndex.value].issueTableData
    takeTableData.value = taskRelationData.value[tabIndex.value].takeTableData
  })
}
const handleToolMenu = (target, val) => {
  if (val === '重新生成') {
    getRelation()
  }
  if (val === '智能辅助') {
    suggest.value = !suggest.value
  }
}
defineExpose({ handleToolMenu })
onMounted(() => {
  getRelation()
})
</script>
<style lang="scss" scoped>
.task_info,
.view_wrapper {
  width: 100%;
  height: 100%;
  background: var(--my-bg-color);
  border-radius: 3px;
  padding: 20px;
  margin-left: 8px;
  display: flex;
  justify-content: space-between;

  .top_task {
    width: 300px;
    height: 100%;

    .top_title {
      width: 100%;
      height: 40px;
      background: var(--my-bg-color-4);
      border: 1px solid var(--el-badge-bg-color);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      margin-bottom: 10px;
      font-weight: 500;
    }

    .task_wrapper {
      border-right: 1px solid var(--my-border-color-2);
      width: 100%;
      height: 100%;

      ul {
        padding-left: 0;

        li {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          cursor: pointer;

          .icon {
            font-size: 15px;
            margin: 0 14px 0 20px;
          }

          span {
            font-size: 15px;
          }

          &:hover {
            background: var(--color-active);
          }
        }
      }
    }
  }

  .table {
    width: calc(100% - 330px);
    height: 100%;
    border-radius: 4px;

    .issue,
    .take {
      padding: 12px;

      .top_info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .icon {
          font-size: 20px;
          color: #388fe6;
          margin-right: 8px;
        }

        span {
          font-size: 15px;
        }

        .flex {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .top_add {
          .icon {
            color: #518edf;
            font-weight: bold;
            font-size: 19px;
            margin: 8px 16px 0 0;
            cursor: pointer;
          }
        }
      }

      .table_wrapper {
        .pagination {
          margin-top: 30px;
          display: flex;
          justify-content: center;
        }

        .butn {
          .el-button {
            padding: 0;

            span {
              .icon {
                font-size: 19px;
                font-weight: bold;
                line-height: 1;
                color: red;
              }
            }
          }
        }
      }
    }
  }

  .form_box {
    padding: 5px 20px 0 0;
  }
}
.image {
  width: 100%;
  height: 100%;
}
.canvas {
  width: 100%;
  height: 100%;
  background: var(--my-bg-color);
  position: relative;
  overflow: hidden;
  display: flex;
}

.view_wrapper {
  padding: 0;
  width: calc(100% - 8px);
}
.graph-container {
  width: 100%;
  height: 100% !important;
  flex: 1 1;
}
.el-badge {
  --el-badge-size: 14px;
  --el-badge-bg-color: #0095d9;
  cursor: pointer;
}
:deep(.el-badge__content--danger) {
  background-color: #0095d9;
}
.suggest_ul {
  list-style: none;
  padding-left: 0;
  li {
    display: flex;
    img {
      width: 14px;
      height: 14px;
      margin: 3px 5px 0 0;
    }
  }
}
.icon-jiqiren_o {
  font-size: 18px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
