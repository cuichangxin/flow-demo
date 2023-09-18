<template>
  <div class="test_record">
    <header>
      <!-- <div class="header-left">
        <el-select v-model="project" @change="handleSelect">
          <el-option
            v-for="(item, index) in projectList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          v-model="keyword"
          placeholder="检索用例"
          :prefix-icon="Search"
          class="search"
          @input="search"
        ></el-input>
      </div> -->
      <div class="record_all">
        <div class="record_all_item" v-for="(item, index) in recordAllList" :key="index">
          <span class="label" :style="{ color: recordListColor[index] }">{{ item.recordName }}</span>
          <div class="record_all_item_content">{{ item.value }}</div>
        </div>
      </div>
    </header>
    <section class="record_body">
      <!-- <el-table :data="tableData.tableData" :max-height="tableHeight" :cell-style="cellStyle">
        <el-table-column label="序号" width="100" type="index" :index="(index) => index + 1"></el-table-column>
        <el-table-column prop="needName" label="需求名称"></el-table-column>
        <el-table-column prop="testCase" label="测试用例集"></el-table-column>
        <el-table-column prop="testingEnvironment" label="测试环境"></el-table-column>
        <el-table-column prop="testCaseCount" label="测试用例数"></el-table-column>
        <el-table-column prop="testRes" label="测试结果"></el-table-column>
        <el-table-column prop="cover" label="需求覆盖率"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="tableData.tableData.length"
          :page-size="pagesize"
          :current-page="currentPage"
          @current-change="handlerCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div> -->
      <h3 class="title">测试概览</h3>
      <div class="record-wrapper">
        <div class="record-item" v-for="(item, index) in recordOverAllList" :key="index">
          <header>
            <span class="test-name">{{ item.name }}</span>
            <el-dropdown trigger="click" @command="(e) => command(e, item)">
              <i class="status_shape iconfont icon-qita"></i>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="测试管理">测试管理</el-dropdown-item>
                  <el-dropdown-item command="测试报告">测试报告</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </header>
          <section>
            <div class="status_wrapper">
              <span class="status_title">状态:</span>
              <span class="status_item" :style="{ color: recordOverallColor[item.status] }">{{
                RECORDSTATUS[item.status]
              }}</span>
            </div>
            <div class="status_wrapper">
              <span class="status_title">测试类型:</span>
              <span class="status_item">{{ item.type }}</span>
            </div>
            <div class="status_wrapper">
              <span class="status_title">测试时间:</span>
              <span class="status_item">{{ item.createTime }}</span>
            </div>
            <div class="status_wrapper">
              <span class="status_title">代码版本:</span>
              <span class="status_item">{{ item.version }}</span>
            </div>
          </section>
        </div>
      </div>
    </section>
    <Dialog
      :width="'40%'"
      :title="changeFlag ? '测试管理' : '测试报告'"
      :hidden-full-btn="true"
      v-model="visible"
      :confirmText="changeFlag ? '应用' : '确认'"
      @confirm="handleConfirm"
      @close="handleClose"
    >
      <el-form v-if="changeFlag" :model="formData" label-width="90px">
        <el-form-item label="测试项目" prop="name">
          <el-input v-model="formData.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status">
            <el-option label="进行中" value="0"></el-option>
            <el-option label="已完成" value="1"></el-option>
            <el-option label="已下线" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="formData.createTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="测试类型" prop="type">
          <el-select v-model="formData.type">
            <el-option label="功能测试" value="功能测试"></el-option>
            <el-option label="性能测试" value="性能测试"></el-option>
            <el-option label="接口测试" value="接口测试"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代码版本" prop="version">
          <el-input v-model="formData.version"></el-input>
        </el-form-item>
      </el-form>
      <el-descriptions v-else direction="vertical" border>
        <el-descriptions-item label="测试项目">{{ report.name }}</el-descriptions-item>
        <el-descriptions-item label="测试日期">{{ report.createTime }}</el-descriptions-item>
        <el-descriptions-item label="操作系统">{{ report.system }}</el-descriptions-item>
        <el-descriptions-item label="测试用例总数">{{ report.useCaseTotal }}</el-descriptions-item>
        <el-descriptions-item label="失败用例数">{{ report.failUseCase }}</el-descriptions-item>
        <el-descriptions-item label="测试用例通过率">{{ report.useCaseRate }}</el-descriptions-item>
      </el-descriptions>
    </Dialog>
  </div>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
import _ from 'lodash'
import { allStore } from '@/store'
import { RECORDSTATUS } from '@/utils/map'
import Dialog from '../../common/dialog/dialog.vue'
import useDialog from '../../../hooks/useDialog'

const { visible: visible, openDialog: openDialog, closeDialog: closeDialog } = useDialog()

const store = allStore()
const recordListColor = ['#4988dd', '#666', '#44b364', '#d64035']
const recordOverallColor = {
  0: '#336deb',
  1: '#44b364',
  2: '#666',
}
const projectList = ref([
  {
    label: 'xxx火箭飞控软件项目',
    value: '1',
  },
  {
    label: '航天软件型号A',
    value: '2',
  },
  {
    label: '航天软件型号B',
    value: '3',
  },
])
const tableHeight = ref(0)
const project = ref('1')
const recordAllList = ref([
  {
    recordName: '用例总数',
    value: '529',
  },
  {
    recordName: '进行中',
    value: '0',
  },
  {
    recordName: '通过',
    value: '436',
  },
  {
    recordName: '未通过',
    value: '93',
  },
])
const keyword = ref('')
const tableData = reactive({
  tableData: [
    {
      needName: '姿态自毁控制功能',
      testCase: '姿态自毁控制',
      testingEnvironment: '仿真环境C',
      testCaseCount: '18',
      testRes: '部分通过',
      cover: '50%',
    },
    {
      needName: '通用数学模型、计算公式功能',
      testCase: '陀螺脉冲转换与零次项误差补偿',
      testingEnvironment: '仿真环境B',
      testCaseCount: '28',
      testRes: '通过',
      cover: '100%',
    },
    {
      needName: '通用数学模型、计算公式功能',
      testCase: '加速度计脉冲转换与零次项误差补偿',
      testingEnvironment: '仿真环境B',
      testCaseCount: '14',
      testRes: '错误',
      cover: '0%',
    },
    {
      needName: '通用数学模型、计算公式功能',
      testCase: '陀螺仪脉冲常零值输出判别',
      testingEnvironment: '仿真环境B',
      testCaseCount: '7',
      testRes: '通过',
      cover: '100%',
    },
    {
      needName: '通用数学模型、计算公式功能',
      testCase: '角速度极大值输出判别',
      testingEnvironment: '仿真环境B',
      testCaseCount: '25',
      testRes: '通过',
      cover: '100%',
    },
    {
      needName: '通用数学模型、计算公式功能',
      testCase: '陀螺仪安装误差补偿',
      testingEnvironment: '仿真环境B',
      testCaseCount: '20',
      testRes: '通过',
      cover: '100%',
    },
    {
      needName: '外部ms中断处理功能',
      testCase: '中断内运行时间开销',
      testingEnvironment: '仿真环境A',
      testCaseCount: '35',
      testRes: '通过',
      cover: '100%',
    },
    {
      needName: '20ms中断处理功能',
      testCase: '中断内运行时间开销',
      testingEnvironment: '仿真环境C',
      testCaseCount: '24',
      testRes: '通过',
      cover: '100%',
    },
    {
      needName: '助推耗尽关机控制功能',
      testCase: '关机控制',
      testingEnvironment: '仿真环境A',
      testCaseCount: '37',
      testRes: '通过',
      cover: '100%',
    },
  ],
})
let copyData = _.cloneDeep(tableData.tableData)
let recordCopyData = _.cloneDeep(recordAllList.value)
const searchId = ref(1)
const cloneSearchData = ref([])
const currentPage = ref(1)
const pagesize = ref(10)
/**
 * @param {status} 0 进行中  1 已完成  2 下线
 */
const recordOverAllList = ref([
  {
    name: 'XXX火箭飞控系统',
    status: '0',
    createTime: '2023-08-14 09:00:00',
    version: '1.0',
    type: '功能测试',
    system: 'ubuntu20.04',
    useCaseTotal: 126,
    failUseCase: 21,
    useCaseRate: '83%',
  },
  {
    name: 'XXX综控器监控软件',
    status: '0',
    createTime: '2023-08-14 09:00:00',
    version: '1.0',
    type: '功能测试',
    system: 'ubuntu20.04',
    useCaseTotal: 179,
    failUseCase: 33,
    useCaseRate: '82%',
  },
  {
    name: '航天软件型号A',
    status: '1',
    createTime: '2023-07-12 11:30:12',
    version: '1.0',
    type: '性能测试',
    system: 'ubuntu20.04',
    useCaseTotal: 213,
    failUseCase: 16,
    useCaseRate: '93%',
  },
  {
    name: '航天软件型号B',
    status: '2',
    createTime: '2023-07-11 12:12:40',
    version: '1.0',
    type: '接口测试',
    system: 'ubuntu20.04',
    useCaseTotal: 155,
    failUseCase: 82,
    useCaseRate: '47%',
  },
])
const formData = ref({
  name: '',
  status: '',
  createTime: '',
  version: '',
  type: '',
})
const report = ref({
  name: '',
  createTime: '',
  system: '',
  useCaseTotal: '',
  failUseCase: '',
  useCaseRate: '',
})
const changeFlag = ref(false)
const command = (e, item) => {
  if (e === '测试管理') {
    changeFlag.value = true
    formData.value = JSON.parse(JSON.stringify(item))
    openDialog()
  }
  if (e === '测试报告') {
    changeFlag.value = false
    report.value = JSON.parse(JSON.stringify(item))
    openDialog()
  }
}
const handleConfirm = () => {
  if (changeFlag.value) {
    recordOverAllList.value.forEach((item) => {
      if (item.name === formData.value.name) {
        console.log(item, '------', formData.value)
        item.status = formData.value.status
        item.createTime = formData.value.createTime
        item.version = formData.value.version
        item.type = formData.value.type
      }
    })
  }
  closeDialog()
}
const handleClose = () => {
  closeDialog()
}

const handlerCurrentChange = (val) => {
  currentPage.value = val
}
const handleSizeChange = () => {
  currentPage.value = 1
}

const search = (e) => {
  if (e == '') {
    tableData.tableData = cloneSearchData.value
    return
  }
  if (searchId.value == 1) {
    cloneSearchData.value = _.cloneDeep(tableData.tableData)
    searchId.value = 0
  }
  let codeArr = ['needName', 'testCase', 'testingEnvironment', 'testRes', 'cover', 'testCaseCount']
  let searchReg = new RegExp(e)
  let filterArr = cloneSearchData.value.filter((data) => {
    return Object.values(Object.fromEntries(Object.entries(data).filter((keys) => codeArr.includes(keys[0])))).some(
      (v) => searchReg.test(v)
    )
  })
  tableData.tableData = filterArr
}
function cellStyle({ row, column, rowIndex, columnIndex }) {
  if (row.testRes === '通过' && (columnIndex === 6 || columnIndex === 5)) {
    return { color: '#81B337' }
  } else if (row.testRes === '错误' && (columnIndex === 6 || columnIndex === 5)) {
    return { color: '#BD3124' }
  } else if (row.testRes === '部分通过' && (columnIndex === 6 || columnIndex === 5)) {
    return { color: '#E99D42' }
  }
}

const handleSelect = (val) => {
  if (val === '1') {
    tableData.tableData = copyData
    recordAllList.value = recordCopyData
  } else if (val === '2') {
    tableData.tableData = dataList_2
    recordAllList.value = recordAllList_2
  } else if (val === '3') {
    tableData.tableData = dataList_3
    recordAllList.value = recordAllList_3
  }
}

onMounted(() => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 390
  })
  window.addEventListener('resize', () => {
    tableHeight.value = window.innerHeight - 390
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})

const dataList_2 = [
  {
    needName: '姿态自毁控制功能',
    testCase: '姿态自毁控制',
    testingEnvironment: '仿真环境C',
    testCaseCount: '18',
    testRes: '部分通过',
    cover: '50%',
  },
]
const dataList_3 = [
  {
    needName: '姿态自毁控制功能',
    testCase: '姿态自毁控制',
    testingEnvironment: '仿真环境C',
    testCaseCount: '18',
    testRes: '部分通过',
    cover: '50%',
  },
  {
    needName: '通用数学模型',
    testCase: '陀螺脉冲转换与零次项误差补偿',
    testingEnvironment: '仿真环境C',
    testCaseCount: '18',
    testRes: '通过',
    cover: '100%',
  },
]
const recordAllList_2 = [
  {
    recordName: '用例总数',
    value: '233',
  },
  {
    recordName: '通过',
    value: '125',
  },
  {
    recordName: '未通过',
    value: '108',
  },
]
const recordAllList_3 = [
  {
    recordName: '用例总数',
    value: '491',
  },
  {
    recordName: '通过',
    value: '323',
  },
  {
    recordName: '未通过',
    value: '168',
  },
]
</script>
<style lang="scss" scoped>
.test_record {
  /* background-color: #fff; */
  margin: 0 8px;
  border-radius: 8px;
  padding: 10px 0;
  height: calc(100% - 65px);
  /* box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.1); */
}

header {
  display: flex;
  margin-bottom: 10px;
}
.record_body {
  .title {
    font-weight: 600;
  }
}
.record_all {
  width: 100%;
  /* margin-left: 30px; */
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 100%;
  padding: 20px 0;
  border-radius: 3px;
}

.record_all_item {
  width: 280px;
  height: 100px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(128, 127, 127, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  background-color: #fff;
  .label {
    display: inline-block;
    font-size: 18px;
    font-weight: 600;
  }
}

.record_all_item_content {
  font-size: 30px;
  font-family: din;
  font-weight: normal;
  color: #414770;
}

.search {
  width: 190px;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.header-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.record-wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .record-item {
    width: 24%;
    height: 200px;
    background-color: #fff;
    box-shadow: 0px 0px 10px rgba(128, 127, 127, 0.2);
    border-radius: 10px;
    padding: 15px;
    /* margin: 15px 15px 0 0; */
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .test-name {
        display: inline-block;
        font-weight: 600;
        color: #333;
      }
      .status_shape {
        font-size: 24px;
        cursor: pointer;
        &:hover {
          color: #2c67ea;
        }
      }
    }
    section {
      display: inline-block;
      margin-top: 8px;
    }
    .status_wrapper {
      display: flex;
      align-items: center;
      margin-bottom: 14px;
      .status_title,
      .status_item {
        font-size: 14px;
        color: #afb2b6;
      }
      .status_item {
        margin-left: 10px;
        color: #000;
      }
    }
  }
}
</style>
