<template>
  <div
    class="iframe_wrap"
    v-loading="loading"
    element-loading-text="加载中..."
  >
    <iframe id="iframe" class="iframe" src="http://172.20.10.2:3000/#/duty" frameborder="0"></iframe>
  </div>
</template>
<script setup>
const router = useRouter()
const loading = ref(true)

watch(
  () => router.currentRoute.value,
  (n) => {
    if (n.path === '/system/eventRoom') {
      nextTick(() => {
        const dom = document.getElementById('iframe')
        dom.onload = function () {
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
  height: calc(100% - 65px);
  margin: 8px;
  overflow: hidden;
}
.iframe {
  width: 100%;
  height: 100%;
  border: 1px solid #dadada;
  background-color: #fff;
  border-radius: 8px;
}
</style>
