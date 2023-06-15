<template>
  <template v-if="checkType">
    <template v-for="item in menus" :key="item.name">
      <template v-if="item.hide">
        <el-sub-menu v-if="item.children && item.children.length" :index="item.link">
          <template #title>
            <i class="iconfont icon" :class="[item.icon]"></i>
            <span>{{ item.name }}</span>
          </template>
          <sidebarMenu :menus="item.children"></sidebarMenu>
        </el-sub-menu>

        <app-link v-else :to="item.link">
          <el-menu-item :index="item.link">
            <template #title>
              <i class="iconfont icon" :class="[item.icon]"></i>
              <span>{{ item.name }}</span>
            </template>
          </el-menu-item>
        </app-link>
      </template>
    </template>
  </template>

  <el-menu-item v-else :index="menus.link">
    <template #title>
      <i class="iconfont icon" :class="[item.icon]"></i>
      <span>{{ menus.name }}</span>
    </template>
  </el-menu-item>
</template>
<script setup>
import appLink from '../common/link.vue'

const props = defineProps({
  menus: {
    type: [Array, Object],
    required: true
  }
})
const checkType = computed(() => {
  return Array.isArray(props.menus)
})
</script>
<style lang="scss" scoped>
.icon {
  margin-right: 9px;
  font-size: 16px;
}
</style>