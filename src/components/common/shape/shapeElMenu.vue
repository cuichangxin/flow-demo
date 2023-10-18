<template>
  <template v-if="checkType">
    <template v-for="item in menus" :key="item.title">
      <el-sub-menu v-if="item.children && item.children.length" :index="item.title">
        <template #title>
          <i class="iconfont" :class="[item.icon]"></i>
          <span>{{ item.title }}</span>
        </template>
        <shapeElMenu :menus="item.children" :tabIdx="tabIdx"></shapeElMenu>
      </el-sub-menu>

      <div v-else>
        <el-menu-item v-if="!item.hide" :index="item.title" :disabled="item.disabled">
          <template #title>
            <i class="iconfont" :class="[item.icon]"></i>
            <span>{{ item.title }}</span>
          </template>
        </el-menu-item>
      </div>
    </template>
  </template>

  <el-menu-item v-else :index="menus.title">
    <template #title>
      <span>{{ menus.title }}</span>
    </template>
  </el-menu-item>
</template>
<script setup>
const props = defineProps({
  menus: {
    type: [Array, Object],
    required: true,
  },
  tabIdx: {
    type: Number,
  },
})

const checkType = computed(() => {
  return Array.isArray(props.menus)
})
</script>
<style scoped lang="scss">
.iconfont {
  font-size: 19px;
  margin-right: 4px;
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: transparent;
}

.switch {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border: none;
}
.hide {
  overflow: hidden;
  display: flex;
  align-items: center;
}
.el-menu--horizontal .el-menu .el-menu-item.is-active{
  background-color: #409eff;
  color: #fff;
}
</style>
