<template>
  <div class="results">
    <el-scrollbar style="padding: 10px 10px 0">
      <el-radio-group v-model="radio" @change="changeRadio">
        <el-radio-button v-for="(item, index) in radioList" :key="index" :label="item.label" />
      </el-radio-group>
      <el-table class="table" :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border @selection-change="handleSelectionChange">
        <el-table-column v-if="isCheckout" type="selection" width="55" />
        <el-table-column label="序号" width="80" type="index" :index="(index) => index + 1"></el-table-column>
        <el-table-column prop="resultsType" label="成果类型" />
        <el-table-column prop="resultsName" label="成果名称" />
        <el-table-column prop="version" label="版本号" />
        <el-table-column prop="lastChangeTime" label="最后修改时间" />
        <el-table-column prop="lastChangeUser" label="最后修改人" />
        <el-table-column prop="firstChangeTime" label="首次创建时间" />
        <el-table-column prop="firstChangeUser" label="首次创建人" />
        <el-table-column label="文档下载">
          <template #default="scope">
            <el-button type="primary" link>点击下载文档</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="checkoutHandle">需求评审</el-button>
        <el-button type="primary" :disabled="disabled" @click="createDocx">生成文档</el-button>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :total="tableData.length"
          :page-size="pagesize"
          :current-page="currentPage"
          @current-change="handlerCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
    </el-scrollbar>
    <Dialog
      title="评审报告"
      :hidden-full-btn="false"
      :width="'50%'"
      v-model="visible"
      @confirm="handleConfirm"
      @close="handleClose"
    >
      <div class="docx"></div>
    </Dialog>
  </div>
</template>
<script setup>
import Dialog from '../components/common/dialog/dialog.vue'
import useDialog from '../hooks/useDialog'
import { renderAsync } from 'docx-preview'

const { visible: visible, openDialog: openDialog, closeDialog: closeDialog } = useDialog()

const radio = ref('软件需求')
const radioList = reactive([
  {
    label: '软件需求',
  },
  {
    label: '软件架构',
  },
  {
    label: '详细设计',
  },
  {
    label: '仿真环境',
  },
  {
    label: '代码',
  },
  {
    label: '代码审查结果',
  },
  {
    label: '静态分析结果',
  },
  {
    label: '软件测试',
  },
  {
    label: '文档',
  },
  {
    label: '目标码',
  },
  {
    label: '测试报告',
  },
])
const tableData = ref([
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-16 09:47:51',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 09:47:50',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-16 14:51:50',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 14:51:49',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-16 15:25:18',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 15:25:17',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-16 15:43:22',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 15:43:21',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-17 14:22:22',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-17 14:22:22',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-20 02:57:08',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 02:57:08',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-20 07:23:24',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 07:23:24',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-20 08:04:17',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 08:04:17',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-20 08:26:29',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 08:26:29',
    firstChangeUser: 'admin',
  },
])
const tableDataClone = ref([
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-16 09:47:51',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 09:47:50',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-16 14:51:50',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 14:51:49',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-16 15:25:18',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 15:25:17',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-16 15:43:22',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 15:43:21',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-17 14:22:22',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-17 14:22:22',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-20 02:57:08',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 02:57:08',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-20 07:23:24',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 07:23:24',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-20 08:04:17',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 08:04:17',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件需求',
    resultsName: '软件需求',
    version: '1',
    lastChangeTime: '2023-02-20 08:26:29',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 08:26:29',
    firstChangeUser: 'admin',
  },
])
const tableData_2 = reactive([
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-16 09:47:51',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 09:47:50',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-16 09:50:29',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 09:50:37',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-16 15:29:29',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 15:29:29',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-16 09:47:51',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 09:47:50',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-16 15:46:09',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 15:46:09',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-20 03:00:56',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 03:00:56',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-20 07:28:52',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 07:28:52',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-20 08:06:45',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 08:06:45',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-16 09:47:51',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-16 09:47:50',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-20 08:28:57',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-20 08:28:57',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-21 01:07:12',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-21 01:07:12',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-21 01:56:06',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-21 01:56:06',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-21 06:09:18',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-21 06:09:18',
    firstChangeUser: 'admin',
  },
  {
    resultsType: '软件架构',
    resultsName: '软件架构',
    version: '1',
    lastChangeTime: '2023-02-21 07:31:52',
    lastChangeUser: 'admin',
    firstChangeTime: '2023-02-21 07:31:52',
    firstChangeUser: 'admin',
  },
])
const pagesize = ref(10)
const currentPage = ref(1)
const isCheckout = ref(false)
const disabled = ref(true)

const handlerCurrentChange = (val) => {
  currentPage.value = val
}
const handleSizeChange = () => {
  currentPage.value = 1
}
const handleSelectionChange = (val) => {
  console.log(val)
  if (val.length) {
    disabled.value = false
  } else {
    disabled.value = true
  }
}
const changeRadio = (e) => {
  console.log(e)
  switch (e) {
    case '软件需求':
      tableData.value = tableDataClone.value
      break
    case '软件架构':
      tableData.value = tableData_2
      break
    default:
      break
  }
}
const checkoutHandle = () => {
  isCheckout.value = !isCheckout.value
  if (!isCheckout.value) {
    disabled.value = true
  }
}
const handleConfirm = () => {
  closeDialog()
}
const handleClose = () => {
  closeDialog()
}
const createDocx = () => {
  openDialog()
  previewFile()
}
function previewFile() {
  nextTick(() => {
    fetch('/assets/mock/word/4.docx')
      .then((response) => {
        const docData = response.blob()
        const html = document.getElementsByClassName('docx')

        renderAsync(docData, html[0]).then((res) => {
          console.log('res---->', res)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  })
}
</script>
<style lang="scss" scoped>
.results {
  background-color: #fff;
  margin: 9px;
  height: calc(100% - 65px);
  border-radius: 4px;
  .table {
    margin-top: 40px;
  }
}
.pagination {
  margin-top: 30px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}
:deep(.docx-wrapper) {
  background-color: #f4f4f4;
}
:deep(.docx-wrapper > section.docx) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
</style>
