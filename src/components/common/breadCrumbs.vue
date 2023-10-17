<template>
  <div class="bread">
    <el-breadcrumb :separator-icon="ArrowRight">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item
          v-for="(breads, index) in bread"
          :key="breads.path"
          :class="{ 'font-bold': index === bread.length - 1 }"
        >
          <span>{{ breads.meta.title }}</span>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
    <div v-if="isBack" class="back" @click="backUp">
      <i class="iconfont icon-fh" title="返回上一级"></i>
    </div>
  </div>
</template>
<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const bread = ref([])
const isBack = ref(false)
const routerBlack = ['/modeling', '/work', '/testManager/testCase','/demandAnalysis','/demandReview']

watch(
  () => router.currentRoute.value,
  (n) => {
    if (routerBlack.includes(n.path)) {
      isBack.value = true
    }else {
      isBack.value = false
    }
  },{immediate:true}
)

function getBreadCrumb() {
  let matched = route.matched.filter((item) => item.meta && item.meta.title)
  const first = matched[0]
  if (isDashBroad(first)) {
    matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched)
  }
  bread.value = matched
}
function isDashBroad(route) {
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.trim() === 'index'
}
watchEffect(() => {
  getBreadCrumb()
})

const backUp = () => {
  router.go(-1)
}

getBreadCrumb()
</script>
<style lang="scss" scoped>
.bread {
  margin: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.back {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: absolute;
  right: 0;
  i{
    font-size: 24px;
    color: #666666;
    transition: all .3s;
    &:hover{
      color: #3a75f9;
    }
  }
}
</style>
