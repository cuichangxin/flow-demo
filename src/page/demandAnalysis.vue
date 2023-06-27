<!-- 需求分析 -->
<template>
  <div
    class="iframe_wrap"
    v-loading="loading"
    element-loading-text="加载中..."
  >
    <iframe id="iframe" class="iframe" src="http://192.168.30.117:3000/#/da" frameborder="0"></iframe>
  </div>
</template>
<script setup>
import Cookies from 'js-cookie'

const router = useRouter()
const loading = ref(true)

watch(
  () => router.currentRoute.value,
  (n) => {
    if (n.path === '/demandAnalysis') {
      nextTick(() => {
        const dom = document.getElementById('iframe')
        const myWindow = dom.contentWindow
        dom.onload = function () {
          loading.value = false
          myWindow.postMessage({ taskId: Cookies.get('taskId') }, 'http://192.168.30.117:3000')
        }
      })
    }
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.iframe_wrap {
  height: calc(100% - 65px);
  margin: 8px;
}
.iframe {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>
