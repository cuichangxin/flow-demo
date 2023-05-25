<template>
  <el-steps :active="isActive" align-center finish-status="success">
    <el-step v-for="(step, index) in stepsList" :key="index" :description="step.name"></el-step>
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
    id: '1',
    name: '配置信息',
    desc: ''
  },
  {
    id: '1',
    name: '信息确认',
    desc: ''
  },
])

</script>
<style lang="scss" scoped>
:deep(.el-step__icon){
  width: 30px;
  height: 30px;
}
:deep(.el-step__description){
  font-size: 15px;
  margin-top: 10px;
}
:deep(.el-step.is-horizontal .el-step__line){
  top: 14px;
}
</style>
