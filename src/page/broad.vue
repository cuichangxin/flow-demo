<template>
  <vScaleScreen>
    <el-container class="broad_info">
      <el-main>
        <div v-if="flag" class="flex">
          <div class="broad_left">
            <!--顶部占位 -->
            <div class="top_div"></div>
            <FlowIcon :list="list"></FlowIcon>
            <Flow :list="list"></Flow>
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

let list = ref({})
const serial = ref(15)
const timer = ref(null)
const flag = ref(true)
const timeOut = ref(null)
onMounted(() => {
  window.addEventListener('storage', e => {
    if (e.key == 'next') {
      clearInterval(timer.value)
      serial.value++
      getJson()
    }
    if (e.key == 'reset') {
      clearInterval(timer.value)
      serial.value = 1
      flag.value = false
      nextTick(() => {
        flag.value = true
      })
    }
  })
  // timer.value = setInterval(() => {
  //   if (serial.value > 23) {
  //     clearInterval(timer.value)
  //     timer.value = null
  //     return
  //   }
  //   getJson()
  // }, 7000)
  getJson()
})
const getJson = () => {
  Axios.get(`./mock/flow/${serial.value}.json`).then((res) => {
    list.value = res
    serial.value++
  })
}
onUnmounted(() => {
  localStorage.removeItem('next')
  localStorage.removeItem('reset')
  // clearTimeout(timeOut.value)
  clearInterval(timer.value)
})
</script>
<style lang="scss" scoped>
.broad_info {
  height: 100%;
  background: url('../assets/image/home_bg.png') no-repeat;
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
  height: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
