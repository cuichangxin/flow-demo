<template>
  <div class="management">
    <div class="wrapper">
      <div class="tree-wrapper">
        <el-tree :data="treeData_left" :default-expand-all="true" />
      </div>
      <div class="tree-wrapper">
        <el-tree :data="treeData_right" :default-expand-all="true" />
      </div>
    </div>
  </div>
</template>
<script setup>
const { proxy } = getCurrentInstance()

const requestValue = ['testCase', 'need']
const treeData_left = ref([])
const treeData_right = ref([])
proxy.$axios.getDemandList({ demandId: requestValue[0] }).then((res) => {
  treeData_left.value = JSON.parse(res.data.daTree).rowTree
})
proxy.$axios.getDemandList({ demandId: requestValue[1] }).then((res) => {
  treeData_right.value = JSON.parse(res.data.daTree).columnTree
})
</script>
<style lang="scss" scoped>
.management {
  display: flex;
  justify-content: center;
  .wrapper{
    display: flex;
  }
  .tree-wrapper {
    border-radius: 4px;
    padding: 10px;
    background-color: #fff;
    width: 400px;
    min-height: 400px;
    &:first-child {
      margin-right: 120px;
    }
  }
}
</style>
