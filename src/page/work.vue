<template>
  <div class="work">
    <shapeHeader class="shape_header" @handleMenu="handleMenu" :canRedo="history.canRedo" :canUndo="history.canUndo"></shapeHeader>
    <div class="wrapper">
      <StepMenu @checkTab="checkTab" ref="stepMenuRef"></StepMenu>
      <el-container>
        <el-main class="el-main-info">
          <div class="wrapper" v-show="tabIdx == 0">
            <Canvas ref="childRef" @handleHistory="handleHistory"></Canvas>
            <TableControl ref="controlRef"></TableControl>
          </div>
          <div class="over" v-show="tabIdx == 1">
            <OverAll></OverAll>
          </div>
          <div class="relation" v-show="tabIdx == 2">
            <TaskRelation v-show="tabIdx == 2"></TaskRelation>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script setup>
import StepMenu from '../components/business/work/stepMenu.vue'
import Canvas from '../components/business/work/midCanvas.vue'
import TableControl from '../components/business/work/taskControl.vue'
import OverAll from '../components/business/work/overAll.vue'
import TaskRelation from '../components/business/work/taskRelation.vue'
import shapeHeader from '../components/common/shapeHeader.vue'

const tabIdx = ref(0)
const childRef = ref(null)
const stepMenuRef = ref(null)
const controlRef = ref(null)
const hide = ref(false)
const history = reactive({
  canUndo:false,
  canRedo:false
})

const checkTab = (index) => {
  tabIdx.value = index
}
const handleMenu = (val) => {
  if (val === '保存') {
    childRef.value.saveTaskDetail()
  }else if (val === '格式') {
    hide.value = !hide.value
    childRef.value.handleToolMenu(hide.value,val)
    stepMenuRef.value.handleToolMenu(hide.value,val)
    controlRef.value.handleToolMenu(hide.value,val)
  }else {
    childRef.value.handleToolMenu('none',val)
  }
}
const handleHistory = ({canUndo,canRedo}) => {
  history.canUndo = canUndo
  history.canRedo = canRedo
}
</script>
<style lang="scss" scoped>
.work {
  height: calc(100% - 66px);
  margin: 0 8px;
  overflow: hidden;
  flex-wrap: wrap;
  align-content: flex-start;
  background-color: #f4f4f4;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
.shape_header{
  border-radius: 3px;
}
.wrapper{
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
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
.over,
.relation {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  width: 100%;
  height: 100%;
}
</style>
