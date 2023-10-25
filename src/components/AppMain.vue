<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="caches">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script setup>
import { useKeepAliver } from '../store/keepAlive';
const { caches } = useKeepAliver()
</script>

<style lang="scss" scoped>
.app-main {
  min-height: calc(100vh - 106px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding-bottom: 20px;
}
</style>
