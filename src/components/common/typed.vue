<template>
  <pre class="msg" ref="textRef"></pre>
</template>

<script setup>
import TypeIt from 'typeit'

const props = defineProps({
  strings: { type: String },
})
const textRef = ref(null)

function typewriting() {
  new TypeIt(textRef.value, {
    strings: props.strings,
    cursorChar: '', //用于光标的字符。HTML也可以
    speed: 400,
    lifeLike: true, // 使打字速度不规则
    waitUntilVisible: true,
  }).go()
}

onMounted(() => {
  typewriting()
})
</script>

<style lang="scss" scoped>
.msg {
  color: #16e4aa;
  font-size: 12px;
  font-weight: bold;
  transform: scale(0.9);
  margin: 3px 0 0;
  font-family: system-ui;
}
</style>
