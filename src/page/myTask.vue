<template>
  <div class="task_info" v-loading="loading" element-loading-text="加载中...">
    <el-table
      :data="tableList.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
      border
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="cellStyle"
      :max-height="tableHeight"
    >
      <el-table-column align="center" label="序号" width="80">
        <template #default="scope">
          <el-badge v-if="scope.row.isNew === 0" class="badge" value="新">
            {{ scope.$index + (currentPage - 1) * pagesize + 1 }}
          </el-badge>
          <span v-else>{{ scope.$index + (currentPage - 1) * pagesize + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="任务名称"></el-table-column>
      <el-table-column align="center" prop="projectName" label="项目名称"> </el-table-column>
      <el-table-column align="center" prop="beginTime" label="任务分配时间"> </el-table-column>
      <el-table-column align="center" prop="endTime" label="要求完成时间"> </el-table-column>
      <el-table-column align="center" prop="subStatus" label="状态" width="120"> </el-table-column>
      <el-table-column align="center" label="动作" width="150">
        <template #default="scope">
          <el-button link @click="goTask(scope.row)">
            <el-icon color="#3b6bde" size="20">
              <VideoPlay />
            </el-icon>
          </el-button>
          <el-button link :disabled="scope.row.status === 1" @click="submit(scope.row)">
            <el-icon :color="scope.row.status === 1 ? '' : '#3b6bde'" size="20">
              <UploadFilled />
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
    <audio ref="audioRef" @ended="ended">
      <source src="../assets/audio/hint.mp3" />
    </audio>
  </div>
</template>
<script setup>
import { UploadFilled, VideoPlay } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import _ from 'lodash'
import Cookies from 'js-cookie'
import { TASKSTATUS } from '@/utils/map'
import { allStore } from '../store/index'
import { storeToRefs } from 'pinia'

const store = storeToRefs(allStore())
const router = useRouter()
const { proxy } = getCurrentInstance()
const currentPage = ref(1)
const pagesize = ref(10)
const tableHeight = ref(0)
const tableList = ref([])
const taskStatus = TASKSTATUS
const beingTask = ref([])
const loading = ref(true)

const handlerCurrentChange = (val) => {
  currentPage.value = val
}
const handleSizeChange = () => {
  currentPage.value = 1
}

function tableHeaderCellStyle() {
  return {
    background: '#efefef',
  }
}
function cellStyle({ row, column, rowIndex, columnIndex }) {
  if (row.status === 1 && columnIndex === 5) {
    return { color: '#81B337' }
  } else if (row.status === 2 && columnIndex === 5) {
    return { color: '#BD3124' }
  } else if (row.status === 3 && columnIndex === 5) {
    return { color: '#E99D42' }
  }
}
onMounted(() => {
  getTask()
  nextTick(() => {
    tableHeight.value = window.innerHeight - 238
  })
  window.addEventListener('resize', () => {
    tableHeight.value = window.innerHeight - 238
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
  window.removeEventListener('click', () => {})
})

const goTask = (row) => {
  const roleId = Cookies.get('roleId')
  let path
  switch (roleId) {
    case '1':
      path = 'demandAnalysis'
      break
    case '2':
      path = 'demandReview'
      break
    case '3':
      path = 'emulation'
      break
    case '4':
      path = 'work'
      break
    case '5':
      path = 'modeling'
      break
    case '6':
      path = 'testCase'
      break
    case '7':
      path = 'testRecord'
      break
    default:
      break
  }
  Cookies.set('taskId', row.id)
  if (row.status === 2) {
    Cookies.set('status', row.status)
  } else {
    Cookies.remove('status')
  }
  isNewTask(row)
  router.push({ name: path })
}
const submit = (row) => {
  isNewTask(row)
  proxy.$axios
    .submitTask({
      taskId: row.id,
      roleId: parseInt(Cookies.get('roleId')),
      groupId: row.groupId,
    })
    .then((res) => {
      ElNotification({
        message: '提交成功',
        type: 'success',
      })
      getTask()
    })
}
const getTask = () => {
  proxy.$axios
    .getUserTask({
      typeId: Cookies.get('typeId'),
      roleId: Cookies.get('roleId'),
    })
    .then((res) => {
      loading.value = false
      beingTask.value = res.data.filter((item) => {
        return item.status !== 1
      })
      tableList.value = res.data
      res.data.forEach((item) => {
        item.subStatus = taskStatus[item.status]
        if (item.isNew === 0) {
          if (store.isPlay.value && res.data.length) {
            proxy.$refs.audioRef.play().then((res) => {
              store.isPlay.value = false
            })
            // 监听点击事件
            window.addEventListener('click', () => {
              if (store.isPlay.value && res.data.length) {
                store.isPlay.value = false
                play()
              }
            })
          }
        }
      })
    })
}
function play() {
  proxy.$refs.audioRef.play()
}
function isNewTask(row) {
  if (row.isNew === 0) {
    proxy.$axios.changeTaskStatus({ id: row.id }).then((res) => {
      console.log('isNew remove')
    })
  }
}
const ended = () => {
  console.log('播放完毕')
  window.removeEventListener('click', () => {})
}
</script>
<style lang="scss" scoped>
.task_info {
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin: 8px 8px 0;
  height: calc(100% - 65px);
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
/* :deep(.el-table .cell) {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
} */
:deep(.el-table td.el-table__cell){
  padding: 0;
  height: 43px;
  .cell{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.el-badge {
  --el-badge-size: 14px;
}
</style>
