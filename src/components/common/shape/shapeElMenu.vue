<template>
  <template v-if="checkType">
    <template v-for="item in menus" :key="item.title">
      <el-sub-menu v-if="item.children && item.children.length" :index="item.title">
        <template #title>
          <span>{{ item.title }}</span>
        </template>
        <shapeElMenu :menus="item.children"></shapeElMenu>
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
</template>
<script setup>
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
