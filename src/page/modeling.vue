<script setup>
import DesignMenu from '../components/business/model/designMenu.vue';
import ModelCanvas from '../components/business/model/modelCanvas.vue';
import ModelTable from '../components/business/model/modelTable.vue';
import UseModelMenu from '../components/business/model/useModelMenu.vue'
import shapeHeader from '../components/common/shapeHeader.vue'

const mainH = ref('')
const canUndo = ref(false) // 是否能撤销
const canRedo = ref(false) // 是否能重做

onMounted(() => {
  mainH.value = window.innerHeight - 151
  window.addEventListener('resize', () => {
    mainH.value = window.innerHeight - 151
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => { })
})

const handleMenu = ()=>{

}
</script>
<template>
  <div class="modeling" :style="{ height: `${mainH}px` }">
    <shapeHeader @handleMenu="handleMenu" :canRedo="canRedo" :canUndo="canUndo"></shapeHeader>
    <el-container class="container">
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
  </div>
</template>
<style lang="scss" scoped>
.modeling {
  height: calc(100% - 147px);
  margin: 0 20px;
  background: #f4f4f4;
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.2);
  position: relative;
}
.container{
  height: calc(100% - 40px);
}

.main_info {
  height: 100%;
  padding: 0 0 2px 10px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  transition: height .2s linear;

  .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }
}
</style>
