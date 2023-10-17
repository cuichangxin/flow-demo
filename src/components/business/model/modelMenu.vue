<script setup>
let props = defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
  drag: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "icon-custom-other",
  },
})
const instance = getCurrentInstance()

const checkType = (menus) => {
  return Array.isArray(menus)
}

const dragstart = (e, v) => {
  instance.proxy.$bus.emit('dragStart',v)
}
</script>

<template>
  <template v-if="checkType(menus)">
    <template v-for="item in menus" :key="item.id">
      <el-sub-menu v-if="item.children && item.children.length" :index="item.id">
        <template #title>
          <!-- <i class="iconfont icon" :class="[icon]"></i> -->
          <img src="../../../assets/images/wenjianjia.png" class="sub_img" />
          <span class="title">{{ item.label }}</span>
        </template>
        <modelMenu :menus="item.children" :drag="drag" :icon="icon"></modelMenu>
      </el-sub-menu>
      <el-menu-item v-else :index="item.id" :draggable="drag" :class="{ 'menu-icon': drag }" :data-label="item.label"
        :data-id="item.id" :data-img="item.img" :data-shape="item.shape" :data-fill="item.fill" @dragstart="(e) => dragstart(e, item)">
        <template #title>
          <img class="model_img" src="../../../assets/images/model.png" />
          <span class="title">{{ item.label }}</span>
          <img v-if="item?.img" style="margin-left: 10px" :src="item.img" />
        </template>
      </el-menu-item>
    </template>
  </template>
  <el-menu-item v-else :index="menus.id">
    <template #title>
      <span>{{ menus.label }}</span>
    </template>
  </el-menu-item>
</template>

<style lang="scss" scoped>
.icon {
  font-size: 19px;
}

.sub_img {
  width: 17px;
  height: 17px;
  margin-right: 5px;
}

.model_img {
  width: 17px;
  height: 17px;
  margin-right: 5px;
}
.title{
  font-size: 13px;
}
:deep(.el-sub-menu__title){
  height: 48px;
}
:deep(.el-menu-item){
  height: 43px;
}
</style>