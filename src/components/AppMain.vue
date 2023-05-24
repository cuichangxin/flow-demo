<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <breadCrumbs></breadCrumbs>
      <!-- <transition name="fade-transform" mode="out-in"> -->
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      <!-- </transition> -->
    </router-view>
  </section>
</template>

<script setup>
import breadCrumbs from './common/breadCrumbs.vue'

</script>

<style lang="scss" scoped>
.app-main {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
