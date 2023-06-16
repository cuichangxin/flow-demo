<script setup>
import Header from '../components/common/header.vue'
import Menu from '../components/common/asideMenu.vue'
import { AppMain } from '../components'
</script>

<template>
  <el-container class="container">
    <Header></Header>
    <el-container class="app_container">
      <Menu></Menu>
      <app-main />
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
.container {
  height: 100%;
  flex-direction: column;
}
</style>
