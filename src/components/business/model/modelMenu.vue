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

const checkType = (menus) => {
  return Array.isArray(menus)
}
</script>

<template>
  <template v-if="checkType(menus)">
    <template v-for="item in menus" :key="item.id">
      <el-sub-menu v-if="item.children && item.children.length" :index="item.id">
        <template #title>
          <!-- <i class="iconfont icon" :class="[icon]"></i> -->
          <img src="../../../assets/image/wenjianjia.png" class="sub_img" />
          <span>{{ item.label }}</span>
        </template>
        <modelMenu :menus="item.children" :drag="drag" :icon="icon"></modelMenu>
      </el-sub-menu>
      <el-menu-item v-else :index="item.id" :draggable="drag" :class="{ 'menu-icon': drag }" :data-label="item.label"
        :data-id="item.id" :data-img="item.img" :data-shape="item.shape" :data-fill="item.fill">
        <template #title>
          <img class="model_img" src="../../../assets/image/model.png" />
          <span>{{ item.label }}</span>
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
  margin-right: 6px;
  font-size: 19px;
}

.sub_img {
  width: 19px;
  height: 19px;
  margin-right: 5px;
}

:deep(.el-submenu__title i) {
  color: #000;
  font-size: 15px;
}

.model_img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

:deep(.el-sub-menu__title),:deep(.el-menu-item) {
  border-radius: 4px;
  &:hover {
    background: linear-gradient(to right, #a8cde8,#d7d2cc) !important;
  }
}
</style>