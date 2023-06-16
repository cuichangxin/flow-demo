<!-- 需求分析 -->
<template>
  <div
    class="iframe_wrap"
    v-loading="loading"
    element-loading-text="加载中..."
    :element-loading-spinner="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(122, 122, 122, 0.8)"
  >
    <iframe id="iframe" class="iframe" src="http://192.168.30.117:3000/#/da" frameborder="0"></iframe>
  </div>
</template>
<script setup>
import Cookies from 'js-cookie'

const router = useRouter()
const loading = ref(true)
const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `

watch(
  () => router.currentRoute.value,
  (n) => {
    if (n.path === '/demandAnalysis') {
      nextTick(() => {
        const dom = document.getElementById('iframe')
        const myWindow = dom.contentWindow
        dom.onload = function () {
          myWindow.postMessage({ taskId: Cookies.get('taskId') }, 'http://192.168.30.117:3000')
          loading.value = false
        }
      })
    }
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.iframe_wrap {
  height: calc(100% - 95px);
  margin: 20px;
}
.iframe {
  width: 100%;
  height: 100%;
}
</style>
