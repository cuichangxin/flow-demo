<!-- 需求评审 -->
<template>
  <div
    class="iframe_wrap"
    v-loading="loading"
    element-loading-text="加载中..."
  >
    <iframe id="iframe" class="iframe" src="http://192.168.89.117:3000/#/dr" frameborder="0"></iframe>
    <!-- <iframe id="iframe" class="iframe" src="http://172.20.10.2:3000/#/dr" frameborder="0"></iframe> -->
  </div>
</template>
<script setup>
const router = useRouter()

const loading = ref(true)

watch(
  () => router.currentRoute.value,
  (n) => {
    if (n.path === '/demandReview') {
      nextTick(() => {
        const dom = document.getElementById('iframe')
        const myWindow = dom.contentWindow
        dom.onload = function () {
          loading.value = false
          myWindow.postMessage({ taskId: Cookies.get('taskId') }, 'http://192.168.89.117:3000')
          
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
