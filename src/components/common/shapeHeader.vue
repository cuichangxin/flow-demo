<template>
  <el-menu mode="horizontal" @select="itemClick">
    <shapeElMenu :menus="list"></shapeElMenu>
  </el-menu>
</template>
<script setup>
import shapeElMenu from './shape/shapeElMenu.vue';

const props = defineProps({
  canRedo:{
    type:Boolean,
    default:false
  },
  canUndo:{
    type:Boolean,
    default:false
  }
})
const emit = defineEmits(['handleMenu'])
const list = ref([
  {
    title: '文件',
    children: [
      {
        title: '保存',
      },
      {
        title: '另存为',
      },
    ]
  },
  {
    title: '编辑',
    children: [
      {
        title: '撤销',
      },
      {
        title: '重做',
      },
    ]
  },
  {
    title: '查看',
    children: [
      {
        title: '格式',
      },
      {
        title:'缩略图',
      },
    ]
  },
])

const itemClick = (index,indexPath,item)=>{
  emit('handleMenu',index)
}

watchEffect(()=>{
  list.value.forEach(item=>{
    if (item.children && item.children.length) {
      item.children.forEach(child=>{
        if (child.title === '撤销') {
          child.disabled = !props.canUndo
        }
        if (child.title === '重做') {
          child.disabled = !props.canRedo
        }
      })
    }
  })
})
</script>
<style lang="scss" scoped>
.el-menu {
  height: 40px;
  width: 100%;
  border-radius: 2px;
  margin-bottom: 10px;
  background-color: #e8ecef;
}

.el-menu--horizontal {
  border-bottom: 1px solid #d2d2d2;
  margin-bottom: 0;
}

:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  border-radius: 3px !important;
}
</style>
