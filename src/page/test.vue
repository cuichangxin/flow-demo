<template>
  <div
    id="box"
    :style="{ position: 'relative', width: '800px', height: '600px', overflow: 'hidden', background: 'blank' }"
  >
    <div id="s" :style="{ width: '100%', height: '100%', overflow: 'auto' }">
    </div>
    <div id="ruler" ref="ruler"></div>
  </div>
</template>
<script setup>
import LightRuler from 'light-ruler'

const ruler = ref(null)
onMounted(()=>{
  console.log(ruler.value)
const myRuler = new LightRuler({
  mountRef: ruler.value,
  mode: 'infinite',
  scrollElement: '#s',
  rulerId: 'hsh',
  width: 100,
  height: 100,
  style: {
    mode: 'right',
  },
  onScroll: (x, y) => {
    console.log(x, y)
  },
})
})
</script>
<style lang="scss" scoped></style>
