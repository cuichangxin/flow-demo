<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(bread, index) in bread.breadList" :key="index">{{ bread.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
const route = useRoute()
const bread = reactive({
  breadList: {}
})
function getBreadCrumb() {
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]
  if (isDashBroad(first)) {
    matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched)
  }
  bread.breadList = matched
}
function isDashBroad(route) {
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.trim() === 'index'
}
watchEffect(()=>{
  getBreadCrumb()
})

getBreadCrumb()

</script>
<style lang="scss" scoped>
.el-breadcrumb {
  height: 40px;
  background-color: #fff;
  border-radius: 7px;
  box-shadow: 0px 0px 22px rgba(0, 0, 0, .1);
  margin: 18px;
  font-size: 16px;
  display: flex;
  align-items: center;
  padding-left: 10px;
}
</style>
