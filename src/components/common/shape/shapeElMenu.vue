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

      <el-menu-item v-else :index="item.title" :disabled="item.disabled">
        <template #title>
          <span>{{ item.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </template>

  <el-menu-item v-else :index="menus.title">
    <template #title>
      <span>{{ menus.title }}</span>
    </template>
  </el-menu-item>
  <el-menu-item v-if="tabIdx === 2" class="change-over-btn">
    <el-button type="primary" text @click="changeView">切换视图</el-button>
  </el-menu-item>
</template>
<script setup>

const { proxy } = getCurrentInstance()


const props = defineProps({
  menus: {
    type: [Array, Object],
    required: true,
  },
  tabIdx: {
    type: Number,
  },
})
const viewFlag = ref(false)

const checkType = computed(() => {
  return Array.isArray(props.menus)
})
const changeView = () => {
  viewFlag.value = !viewFlag.value
  proxy.$bus.emit('changeView',viewFlag.value)
}
</script>
<style scoped lang="scss">
.iconfont {
  font-size: 19px;
  margin-right: 4px;
}
:deep(.el-sub-menu__title:hover) {
  background-color: #e9f1f6 !important;
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: transparent;
}
.change-over-btn {
  float: right;
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
.switch {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
