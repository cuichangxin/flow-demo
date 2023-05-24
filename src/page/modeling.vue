<script setup>
import DesignMenu from '../components/business/model/designMenu.vue';
import ModelCanvas from '../components/business/model/modelCanvas.vue';
import ModelTable from '../components/business/model/modelTable.vue';
import UseModelMenu from '../components/business/model/useModelMenu.vue'

const mainH = ref('')
onMounted(() => {
  mainH.value = window.innerHeight - 152
  window.addEventListener('resize', () => {
    mainH.value = window.innerHeight - 152
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>
<template>
  <el-container class="modeling" :style="{ height: `${mainH}px` }">
    <DesignMenu></DesignMenu>
    <el-container>
      <el-main class="main_info">
        <div class="wrapper">
          <ModelCanvas></ModelCanvas>
          <ModelTable></ModelTable>
        </div>
        <UseModelMenu></UseModelMenu>
      </el-main>
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
.modeling {
  width: 100%;
  height: calc(100% - 97px);
  padding: 0 20px 0;
}

.main_info {
  height: 100%;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  transition:  height .2s linear;

  .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }
}
</style>
