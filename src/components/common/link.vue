<template>
  <component :is="type" v-bind="linkProps()" class="router-link" :target="target">
    <slot />
  </component>
</template>
<script setup>
import { isExternal } from '@/utils/utils'

const props = defineProps({
  to:{
    type:String,
    required:true
  },
  target:{
    type:String
  }
})
function linkProps() {
  return {
    to: props.to
  }
}
const isExt = computed(()=>{
  return isExternal(props.to)
})
const type = computed(()=>{
  if (isExt.value) {
    return 'a'
  }
  return 'router-link'
})
</script>
<style lang="scss" scoped>
</style>
