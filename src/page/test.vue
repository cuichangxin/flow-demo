<template>
  <div class="div">
    <SketchRule
      :thick="state.thick"
      :scale="state.scale"
      :width="580"
      :height="580"
      :start-x="state.startX"
      :start-y="state.startY"
      :isShowReferLine="state.isShowReferLine"
      :lines="state.lines"
      :palette="state.palette"
    >
    </SketchRule>
  </div>
</template>
<script setup>
import { SketchRule } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

const rectWidth = 160
const rectHeight = 200
const state = reactive({
  scale: 0.75, //658813476562495, //1,
  startX: -100,
  startY: 0,
  lines: {},
  thick: 20,
  isShowRuler: true, // 显示标尺
  isShowReferLine: false, // 显示参考线
  palette: {
    bgColor: '#181b24', // ruler bg color
    longfgColor: '#BABBBC', // ruler longer mark color
    shortfgColor: '#9C9C9C', // ruler shorter mark color
    fontColor: '#DEDEDE', // ruler font color
    shadowColor: '#525252', // ruler shadow color
    lineColor: '#EB5648',
    borderColor: '#B5B5B5',
    cornerActiveColor: '#fff'

  },
})
</script>
<style lang="scss" scoped>
.div {
  position: absolute;
  width: 600px;
  height: 600px;
  border: 1px solid #dadadc;
}
</style>
