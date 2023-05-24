<!-- 需求分析 -->
<template>
  <iframe id="iframe" class="iframe" src="http://172.20.10.2:3000/#/da" frameborder="0"></iframe>
</template>
<script setup>
import { allStore } from '../store';
import Cookies from 'js-cookie'

const store = allStore()
const route = useRoute()
const router = useRouter()

watch(() => router.currentRoute.value, (n) => {
  if (n.path === "/demandAnalysis") {
    nextTick(() => {
      const dom = document.getElementById('iframe')
      const myWindow = dom.contentWindow
      dom.onload = function () {
        myWindow.postMessage({ taskId: Cookies.get('taskId') }, 'http://172.20.10.2:3000')
      }
    })
  }
}, { immediate: true })
</script>
<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: 90%;
}
</style>
