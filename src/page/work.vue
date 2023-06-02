<template>
  <el-container class="work">
    <StepMenu @checkTab="checkTab"></StepMenu>
    <el-container>
      <el-main class="el-main-info">
        <div class="wrapper" v-show="tabIdx == 0">
          <Canvas></Canvas>
          <TableControl></TableControl>
        </div>
        <div class="over" v-show="tabIdx == 1">
          <OverAll></OverAll>
        </div>
        <div class="relation" v-show="tabIdx == 2">
          <TaskRelation v-show="tabIdx == 2"></TaskRelation>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import StepMenu from '../components/business/work/stepMenu.vue'
import Canvas from '../components/business/work/midCanvas.vue'
import TableControl from '../components/business/work/taskControl.vue'
import OverAll from '../components/business/work/overAll.vue'
import TaskRelation from '../components/business/work/taskRelation.vue'
import Cookies from 'js-cookie'

const { proxy } = getCurrentInstance()
const tabIdx = ref(0)
const checkTab = (index) => {
  tabIdx.value = index
}
function saveHandle(val){
  proxy.$axios.saveTaskDetail({
    taskId: Cookies.get('taskId'),
    daTree:val
  }).then(() => {
    console.log('保存 ---- success');
  })
}
</script>
<style lang="scss" scoped>
.work {
  width: 100%;
  height: calc(100% - 76px);
  padding: 20px;
  overflow: hidden;
}

.el-main-info {
  min-width: 0;
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 0;
  height: 100%;
  overflow: visible;

  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    position: relative;
    overflow: visible;
  }
}
.over,.relation{
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  width: 100%;
  height: 100%;
}
</style>
