<template>
  <!-- :fullScreen="true" -->
  <vScaleScreen :fullScreen="true">
    <el-container class="broad_info">
      <el-main>
        <div class="flex">
          <div class="broad_left">
            <!--顶部占位 -->
            <div class="top_div"></div>
            <FlowIcon :list="list" :serial="serial"></FlowIcon>
            <Flow :list="list" :serials="serial"></Flow>
          </div>
          <Card :list="list"></Card>
        </div>
      </el-main>
    </el-container>
  </vScaleScreen>
</template>

<script setup>
import FlowIcon from '../components/business/broad/flowIcon.vue'
import Flow from '../components/business/broad/flow.vue'
import Card from '../components/business/broad/card.vue'
import Axios from 'axios'
import vScaleScreen from 'v-scale-screen'
import { formatTime } from '../utils/utils'

const { proxy } = getCurrentInstance()
const list = ref({})
const serial = ref(1)
const timer = ref(null)
const specArr = [9, 10, 14, 15, 17, 18, 19, 20, 21, 22, 23]
const jsonCount = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
const sevenStatus = ref(true)
// 20 21 26 27

onMounted(() => {
  let serials = localStorage.getItem('serial')
  if (serials) {
    serial.value = serials
  }

  setTimeout(() => {
    timerTask()
  }, 2000)
  // getJson(serial.value)
})

function timerTask() {
  clearInterval(timer.value)
  timer.value = setInterval(() => {
    boardShow()
  }, 3000)
}
const boardShow = () => {
  proxy.$axios.boardShow({ file: serial.value }).then((res) => {
    if (res.data.file !== null) {
      if (!res.data.flags) {
        serial.value = res.data.file
        localStorage.setItem('serial', res.data.file)
      }
      if (res.data.file === 7) {
        if (sevenStatus.value) {
          sevenStatus.value = false
          clearInterval(timer.value)
          setTimeout(() => {
            getJson(res.data.file)
            timerTask()
          }, 20000)
        } else {
          clearInterval(timer.value)
          setTimeout(() => {
            getJson(res.data.file)
            timerTask()
          }, 5000)
        }
      } else if (specArr.indexOf(res.data.file) !== -1) {
        clearInterval(timer.value)
        setTimeout(() => {
          getJson(res.data.file)
          timerTask()
        }, 5000)
      } else {
        getJson(res.data.file)
      }
    }
  })
}

const getJson = (num) => {
  const time = localStorage.getItem('projectTime')
  Axios.get(`/mock/flow/${num}.json`).then((res) => {
    let resData = res.data
    if (time !== null) {
      resData.sDate = resData.sDate !== null ? formatTime(time,'h') : ''
      resData.eDate = resData.eDate !== null ? formatTime(time,'h') : ''
      resData.rDate = resData.rDate !== null ? formatTime(time,'h') : ''
      resData.activityInfoList.forEach((item)=>{
        if (item?.sDate) item.sDate = formatTime(time,'h')
        if (item?.eDate) item.eDate = formatTime(time,'h')
      })
    }
    setTimeout(()=>{
      list.value = resData
    })
  })
}
onUnmounted(() => {
  clearInterval(timer.value)
})
</script>
<style lang="scss" scoped>
.broad_info {
  height: 100%;
  background: url('../assets/images/home_bg.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
}

.top_div {
  width: 100%;
  /* height: 80px; */
  height: 10%;
}

.broad_left {
  display: flex;
  flex-direction: column;
  margin-right: 40px;
  flex: 1;
}

.flex {
  height: calc(100% - 5px);
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}
</style>
