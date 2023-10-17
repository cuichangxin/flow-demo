<template>
  <el-steps :active="isActive" align-center finish-status="success">
    <el-step v-for="(step, index) in stepsList" :key="index" :title="step.name"></el-step>
  </el-steps>
</template>
<script setup>
const props = defineProps({
  isActive:{
    type:[String,Number]
  }
})
const stepsList = ref([
  {
    id: '1',
    name: '导入任务需求',
    desc: ''
  },
  {
    id: '2',
    name: '配置信息',
    desc: ''
  },
  {
    id: '3',
    name: '信息确认',
    desc: ''
  },
])

</script>
