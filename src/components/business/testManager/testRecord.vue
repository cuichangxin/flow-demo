<template>
  <div class="test_record">
    <header>
      <el-select v-model="project" @change="handleSelect">
        <el-option v-for="(item, index) in projectList" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <div class="record_all">
        <div class="record_all_item" v-for="(item, index) in recordAllList" :key="index">
          <div class="record_all_item_header" :style="{ background: recordListColor[index] }">{{ item.recordName }}</div>
          <div class="record_all_item_content">{{ item.value }}</div>
        </div>
      </div>
    </header>
    <section>
      <el-input v-model="keyword" placeholder="检索用例" :prefix-icon="Search" class="search" @input="search"></el-input>
      <el-table :data="tableData.tableData" :max-height="tableHeight" :cell-style="cellStyle">
        <el-table-column label="序号" width="100" type="index" :index="index => index + 1"></el-table-column>
        <el-table-column prop="needName" label="需求名称"></el-table-column>
        <el-table-column prop="testCase" label="测试用例集"></el-table-column>
        <el-table-column prop="testingEnvironment" label="测试环境"></el-table-column>
        <el-table-column prop="testCaseCount" label="测试用例数"></el-table-column>
        <el-table-column prop="testRes" label="测试结果"></el-table-column>
        <el-table-column prop="cover" label="需求覆盖率"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="tableData.tableData.length" :page-size="pagesize"
          :current-page="currentPage" @current-change="handlerCurrentChange" @size-change="handleSizeChange">
        </el-pagination>
      </div>
    </section>
  </div>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
import _ from 'lodash'
import { allStore } from '@/store';

const store = allStore()
const recordListColor = [
  '#4988dd',
  '#44b364',
  '#d19995'
]
const projectList = ref([
  {
    label: 'xxx火箭飞控软件项目',
    value: '1'
  },
  {
    label: '航天软件型号A',
    value: '2'
  },
  {
    label: '航天软件型号B',
    value: '3'
  },
])
const tableHeight = ref(0)
const project = ref('1')
const recordAllList = ref([
  {
    recordName: '用例总数',
    value: '529'
  },
  {
    recordName: '通过',
    value: '436'
  },
  {
    recordName: '未通过',
    value: '93'
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
      cover: '50%'
    },
    {
      needName: '通用数学模型、计算公式功能',
      testCase: '陀螺脉冲转换与零次项误差补偿',
      testingEnvironment: '仿真环境B',
      testCaseCount: '28',
      testRes: '通过',
      cover: '100%'
    },
    {
      needName: '通用数学模型、计算公式功能',
      testCase: '加速度计脉冲转换与零次项误差补偿',
      testingEnvironment: '仿真环境B',
      testCaseCount: '14',
      testRes: '错误',
      cover: '0%'
    },
    {
      needName: '通用数学模型、计算公式功能',
      testCase: '陀螺仪脉冲常零值输出判别',
      testingEnvironment: '仿真环境B',
      testCaseCount: '7',
      testRes: '通过',
      cover: '100%'
    },
    {
      needName: '通用数学模型、计算公式功能',
      testCase: '角速度极大值输出判别',
      testingEnvironment: '仿真环境B',
      testCaseCount: '25',
      testRes: '通过',
      cover: '100%'
    },
    {
      needName: '通用数学模型、计算公式功能',
      testCase: '陀螺仪安装误差补偿',
      testingEnvironment: '仿真环境B',
      testCaseCount: '20',
      testRes: '通过',
      cover: '100%'
    },
    {
      needName: '外部ms中断处理功能',
      testCase: '中断内运行时间开销',
      testingEnvironment: '仿真环境A',
      testCaseCount: '35',
      testRes: '通过',
      cover: '100%'
    },
    {
      needName: '20ms中断处理功能',
      testCase: '中断内运行时间开销',
      testingEnvironment: '仿真环境C',
      testCaseCount: '24',
      testRes: '通过',
      cover: '100%'
    },
    {
      needName: '助推耗尽关机控制功能',
      testCase: '关机控制',
      testingEnvironment: '仿真环境A',
      testCaseCount: '37',
      testRes: '通过',
      cover: '100%'
    },
  ]
})
let copyData = _.cloneDeep(tableData.tableData)
const searchId = ref(1)
const cloneSearchData = ref([])
const currentPage = ref(1)
const pagesize = ref(10)

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
  let codeArr = ["needName", "testCase", "testingEnvironment", 'testRes', 'cover', 'testCaseCount']
  let searchReg = new RegExp(e)
  let filterArr = cloneSearchData.value.filter((data) => {
    return Object.values(
      Object.fromEntries(
        Object.entries(data).filter((keys) => codeArr.includes(keys[0]))
      )
    ).some((v) => searchReg.test(v))
  })
  tableData.tableData = filterArr
}
function cellStyle({ row, column, rowIndex, columnIndex }) {
  if (row.testRes === '通过' && (columnIndex === 6 || columnIndex === 5)) {
    return { 'color': '#81B337' }
  } else if (row.testRes === '错误' && (columnIndex === 6 || columnIndex === 5)) {
    return { 'color': '#BD3124' }
  } else if (row.testRes === '部分通过' && (columnIndex === 6 || columnIndex === 5)) {
    return { 'color': '#E99D42' }
  }
}

const handleSelect = (val) => {
  if (val === '1') {
    tableData.tableData = copyData
  }else if (val === '2') {
    tableData.tableData = dataList_2
  }else if (val === '3') {
    tableData.tableData = dataList_3
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
  window.removeEventListener('resize', () => { })
})

const dataList_2 = [
  {
    needName: '姿态自毁控制功能',
    testCase: '姿态自毁控制',
    testingEnvironment: '仿真环境C',
    testCaseCount: '18',
    testRes: '部分通过',
    cover: '50%'
  },
]
const dataList_3 = [
  {
    needName: '姿态自毁控制功能',
    testCase: '姿态自毁控制',
    testingEnvironment: '仿真环境C',
    testCaseCount: '18',
    testRes: '部分通过',
    cover: '50%'
  },
  {
    needName: '通用数学模型',
    testCase: '陀螺脉冲转换与零次项误差补偿',
    testingEnvironment: '仿真环境C',
    testCaseCount: '18',
    testRes: '通过',
    cover: '100%'
  },
]
</script>
<style lang="scss" scoped>
.test_record {
  background-color: #fff;
  margin: 0 20px;
  border-radius: 8px;
  padding: 20px;
  height: calc(96% - 60px);
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.1);
}

header {
  display: flex;
}

.record_all {
  flex: 1;
  margin-left: 30px;
  display: flex;
}

.record_all_item {
  flex: 1;
}

.record_all_item_header {
  color: #fff;
  font-weight: 600;
}

.record_all_item_header,
.record_all_item_content {
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  border: 1px solid #d6d6d6;
}

.search {
  width: 190px;
  margin: 10px 0 30px;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>
