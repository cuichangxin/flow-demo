<template>
  <el-menu
    mode="horizontal"
    @select="itemClick"
  >
    <shapeElMenu :menus="list"></shapeElMenu>
  </el-menu>
</template>
<script setup>
import shapeElMenu from '../../common/shape/shapeElMenu.vue'

const props = defineProps({
  tabIdx:{
    type:Number,
  }
})
const emit = defineEmits(['handleMenu'])
const list = ref([
  {
    title: '文件',
    icon: 'icon-wenjian1',
    children: [
      {
        title: '保存',
      },
      {
        title: '另存为',
      },
    ],
  },
  {
    title: '编辑',
    icon: 'icon-bianji1',
    children: [
      {
        title: '批量操作',
      }
    ],
  },
  {
    title:'操作',
    icon:'icon-caozuo-bianji',
    children:[
      {
        title:'智能辅助'
      },
      {
        title:'视图对照'
      }
    ]
  }
])

const itemClick = (index, indexPath, item) => {
  emit('handleMenu', index)
}
</script>
<style lang="scss" scoped>
.el-menu {
  height: 40px;
  width: 100%;
  border-radius: 2px;
  margin-bottom: 10px;
  background-color: var(--header-bg-color);
}

.el-menu--horizontal {
  border-bottom: 1px solid var(--el-border-color);
  margin-bottom: 0;
}
</style>
