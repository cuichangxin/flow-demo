<!-- 需求评审 -->
<template>
  <iframe id="iframe" class="iframe" src="http://172.20.10.2:3000/#/dr" frameborder="0"></iframe>
</template>
<script setup>
import { allStore } from '../store';

const store = allStore()
const route = useRoute()
const router = useRouter()

watch(() => router.currentRoute.value, (n) => {
  if (n.path === "/demandReview") {
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
.iframe{
  width: 100%;
  height: 90%;
}
</style>
