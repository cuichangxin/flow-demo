<template>
  <template v-if="checkType(moduleTree)">
    <template v-for="(item, index) in moduleTree" :key="index">
      <el-sub-menu v-if="item.children && item.children.length" :index="item.id">
        <template #title>
          <img class="sub_img" src="../../../assets/images/wenjianjia.png" />
          <span class="node_label">{{ item.label }}</span>
        </template>
        <modelMenu :moduleTree="item.children"></modelMenu>
      </el-sub-menu>

      <el-menu-item v-else :index="item.id" draggable="true" @dragstart="(e) => dragstart(e, item)" @dragend="dragend">
        <template #title>
          <img class="item_img" src="../../../assets/images/wenjian.png" />
          <span class="node_label">{{ item.label }}</span>
        </template>
      </el-menu-item>
    </template>
  </template>
  <el-menu-item v-else :index="moduleTree.id">
    <template #title>
      <span class="node_label">{{ moduleTree.label }}</span>
    </template>
  </el-menu-item>
</template>
<script setup>
import { workStore } from '@/store/index'


const store = workStore()
let props = defineProps({
  moduleTree: {
    type: Array,
    default: () => []
  }
})
function checkType(menus) {
  return Array.isArray(menus)
}
const dragstart = (e, v) => {
  store.dragEv = v
}
const dragend = () => {
  store.dragEv = null
}

</script>
<style lang="scss" scoped>
.sub_img,.item_img{
  width: 17px;
  height: 17px;
  margin-right: 5px;
}
.node_label{
  font-size: 14px;
}
</style>
