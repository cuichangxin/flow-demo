<script setup>
import Header from '../components/common/header.vue'
import Menu from '../components/common/asideMenu.vue'
import { AppMain } from '../components';
</script>

<template>
    <el-container class="container is-vertical">
      <Header></Header>
      <el-container class="app_container">
        <Menu></Menu>
        <el-main class="main">
          <app-main />
          <!-- <router-view></router-view> -->
        </el-main>
      </el-container>
    </el-container>
</template>
<style lang="scss" scoped>
.container {
  height: 100%;
  flex-direction: column;
}

.app_container {
  /* height: 100%; */
}

.main {
  padding: 0;
}
</style>
