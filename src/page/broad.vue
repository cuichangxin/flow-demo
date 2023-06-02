<template>
  <!-- :fullScreen="true" -->
  <vScaleScreen>
    <el-container class="broad_info">
      <el-main>
        <div v-if="flag" class="flex">
          <div class="broad_left">
            <!--顶部占位 -->
            <div class="top_div"></div>
            <FlowIcon :list="list" :serial="serial"></FlowIcon>
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

const { proxy } = getCurrentInstance()
const list = ref({})
const serial = ref(1)
const timer = ref(null)
const flag = ref(true)
onMounted(() => {
  timer.value = setInterval(() => {
    boardShow()
  }, 3000)
})

const boardShow = () => {
  proxy.$axios.boardShow({ file: serial.value }).then((res) => {
    serial.value = res.data
    getJson(res.data)
  })
}

const getJson = (num) => {
  Axios.get(`http://172.20.10.10:8080/mock/flow/${num}.json`).then((res) => {
    list.value = res
  })
}
onUnmounted(() => {
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
