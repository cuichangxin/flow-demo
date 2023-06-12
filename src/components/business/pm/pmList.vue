<template>
  <section class="list-info">
    <header class="header">
      <el-dropdown v-if="tableList.length" @command="handleCommand" class="button">
        <el-button :disabled="!tableList.length" type="primary">
          切换项目<el-icon><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in tableList" :key="item.optionName" :command="item.type">{{
              item.optionName
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button class="button" type="primary" @click="addProject">
        <el-icon>
          <Plus />
        </el-icon>
        新建项目
      </el-button>
      <el-input
        class="input"
        v-model="keyword"
        placeholder="请输入你需要搜索的项目名称"
        :suffix-icon="Search"
        @input="search"
      ></el-input>
    </header>
    <div class="wrapper">
      <el-table
        :data="tableList.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
        border
        :header-cell-style="tableHeaderCellStyle"
        :max-height="tableHeight"
      >
        <el-table-column align="center" label="序号" width="80">
          <template #default="scope">
            {{ scope.$index + (currentPage - 1) * pagesize + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="optionName" label="配置项名称"></el-table-column>
        <el-table-column align="center" prop="subType" label="软件类型"></el-table-column>
        <el-table-column align="center" prop="subLevel" label="安全关键等级"></el-table-column>
        <el-table-column align="center" prop="codeLang" label="开发语言"></el-table-column>
        <el-table-column align="center" prop="finishTime" label="计划完成时间">
          <template #default="scope">
            <span>{{ formatTime(scope.row.finishTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间">
          <template #default="scope">
            <span>{{ formatTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template #default="scope">
            <el-button link @click="removeItem(scope.row)">
              <el-icon size="18" color="#f20c00">
                <Delete />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="tableList.length"
          :page-size="pagesize"
          :current-page="currentPage"
          @current-change="handlerCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
    </div>
  </section>
</template>
<script setup>
import { Search, Plus, Delete, ArrowDown } from '@element-plus/icons-vue'
import _ from 'lodash'
import Cookies from 'js-cookie'
import { formatTime } from '@/utils/utils'
import { PROJECTMAP, LEVELMAP, CODELANG } from '@/utils/map'

const { proxy } = getCurrentInstance()
const router = useRouter()
const keyword = ref('')
const currentPage = ref(1)
const pagesize = ref(10)
const tableList = ref([])
const cloneSearchData = ref([])
const searchId = ref(1)
const tableHeight = ref(0)

const handlerCurrentChange = (val) => {
  currentPage.value = val
}
const handleSizeChange = () => {
  currentPage.value = 1
}
// 新建项目
const addProject = () => {
  router.push({
    path: '/pm/taskNeed',
  })
}

function tableHeaderCellStyle() {
  return {
    background: '#efefef',
  }
}
const search = (e) => {
  if (e == '') {
    tableList.value = cloneSearchData.value
    return
  }
  if (searchId.value == 1) {
    cloneSearchData.value = _.cloneDeep(tableList.value)
    searchId.value = 0
  }
  let codeArr = ['optionName', 'subType', 'subLevel', 'codeLang']
  let searchReg = new RegExp(e)
  let filterArr = cloneSearchData.value.filter((data) => {
    return Object.values(Object.fromEntries(Object.entries(data).filter((keys) => codeArr.includes(keys[0])))).some(
      (v) => searchReg.test(v)
    )
  })
  tableList.value = filterArr
}
const removeItem = (row) => {
  proxy.$axios
    .removeProject({
      id: row.id,
    })
    .then((res) => {
      proxy.$modal.msgSuccess('删除成功')
      getProject()
    })
}

function getProject() {
  proxy.$axios
    .getProjectList({
      userId: Cookies.get('userId'),
    })
    .then((res) => {
      res.data.forEach((item) => {
        item.subType = PROJECTMAP[item.type]
        item.subLevel = LEVELMAP[item.level]
        item.codeLang = CODELANG[item.deLanguage]
      })
      tableList.value = res.data
    })
}
const handleCommand = (command) => {
  proxy.$axios.projectChange({ type: command }).then((res) => {
    console.log('success')
    proxy.$modal.msgSuccess('切换成功')
  })
}
onMounted(() => {
  tableHeight.value = window.innerHeight - 300
  window.addEventListener('resize', () => {
    tableHeight.value = window.innerHeight - 300
  })
  getProject()
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
// onActivated(() => {
//   getProject()
// })
</script>
<style lang="scss" scoped>
.list-info {
  height: calc(96% - 60px);
  background-color: #fff;
  border-radius: 7px;
  padding: 15px;
  margin: 0 20px;
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.1);
}

.header {
  width: 100%;
  height: 50px;
  padding: 10px;

  .input {
    width: 300px;
    float: right;
  }

  .button {
    float: right;
    margin-left: 20px;
  }
}

.wrapper {
  width: 100%;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>
