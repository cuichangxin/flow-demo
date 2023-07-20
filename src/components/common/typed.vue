<template>
  <pre class="msg">{{ text }}</pre>
</template>
  
<script setup>
const props = defineProps({
  strings: { type: String }
})
const text = ref('')
const timers = ref(null)
onMounted(() => {
  textSplit(props.strings)
})
function textSplit(content) {
  text.value = ''
  let textLen = 0
  timers.value = setInterval(() => {
    text.value = content.substring(0, textLen)
    if (textLen < content.length) {
      textLen++
    } else {
      clearInterval(timers.value)
      timers.value = null
    }
  }, 800)
}
</script>
  
<style lang='scss' scoped>
.msg {
  color: #16e4aa;
  font-size: 12px;
  font-weight: bold;
  transform: scale(0.9);
  margin: 3px 0 0;
  font-family: system-ui;
}
</style>