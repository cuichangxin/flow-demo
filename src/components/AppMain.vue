<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="caches">
          <component :is="Component" :key="key" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script setup>
import { useKeepAliver } from '../store/keepAlive';

const { caches } = storeToRefs(useKeepAliver())
const route = useRoute()
const key = computed(()=>{
  return route.path + Math.random()
})
</script>

<style lang="scss" scoped>
.app-main {
  min-height: calc(100vh - 60px);
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
