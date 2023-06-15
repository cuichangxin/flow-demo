<template>
  <el-table :data="tableData" stripe @row-click="onRowClick" class="table" :max-height="domH">
    <el-table-column prop="key" :label="tableHeader.name !== '' ? tableHeader.name : '属性'" />
    <el-table-column prop="value" :label="tableHeader.code !== '' ? tableHeader.code : '属性值'">
      <template #default="scope">
        <span v-show="scope.$index !== editIndex">{{ scope.row.value }}</span>
        <el-input v-show="scope.$index === editIndex" v-model="scope.row.value" size="small" :ref="inputRef" clearable
          @blur="blur" @keyup.enter="rowEnter" />
      </template>
    </el-table-column>
    <template #empty>
      <img class="no-data" src="@/assets/image/no-data.png" />
      <span class="tip">暂无数据</span>
    </template>
  </el-table>
</template>
<script setup>

let props = defineProps({
  tableList: {
    type: Object,
    default: () => {}
  },
  domH:{
    type:Number,
    default:0
  }
})
let emit = defineEmits(['saveTable'])
const tableData = ref([])
const tableHeader = ref({
  name:'',
  code:''
})
const editIndex = ref(-1)
const inputRef = el => {
  if (el && el.ref !== undefined) {
    el.focus()
    el.select()
  }
}

watch(() => props.tableList, (n) => {
  if (n !== undefined) {
    tableHeader.value.name = n.name
    tableHeader.value.code = n.code
    tableData.value = n.tableData
  }else {
    tableData.value = []
  }
})
const onRowClick = (row) => {
  editIndex.value = tableData.value.indexOf(row)
}
const rowEnter = () => {
  editIndex.value = -1
  emit('saveTable', tableData.value)
}
const blur = () => {
  editIndex.value = -1
  emit('saveTable', tableData.value)
}
</script>
<style lang="scss" scoped>
.table {
  width: 100%;
  height: 100%;
  border-radius: 0 0 3px 3px;
}
.no-data{
  width: 100px;
  height: 100px;
  margin-top: 10px;
}
.tip{
  font-size: 14px;
}
:deep(.el-table__empty-text){
  line-height: normal;
}
</style>
