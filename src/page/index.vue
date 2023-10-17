<script setup>
import breadCrumbs from '../components/common/breadCrumbs.vue'
import topBar from '../components/common/header.vue'
import sidebar from '../components/common/asideMenu.vue'
import { AppMain } from '../components'
</script>

<template>
  <el-container class="container">
    <top-bar></top-bar>
    <el-container class="app_container">
      <sidebar></sidebar>
      <el-scrollbar>
        <bread-crumbs />
        <app-main />
      </el-scrollbar>
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.module.scss";
.app_container{
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.container {
  height: 100%;
  flex-direction: column;
}
.el-scrollbar {
  height: 100%;
  width: 100%;
  padding: 0 20px 0;
}

:deep(.el-scrollbar__bar).is-vertical {
  z-index: 10;
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
</style>
