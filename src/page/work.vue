<template>
  <div class="work">
    <shapeHeader
      class="shape_header"
      @handleMenu="handleMenu"
      :canRedo="history.canRedo"
      :canUndo="history.canUndo"
      :tabIdx="tabIdx"
    ></shapeHeader>
    <el-container class="el-container-layout">
      <StepMenu @checkTab="checkTab" ref="stepMenuRef"></StepMenu>
      <el-container>
        <div class="box" v-show="tabIdx == 0">
          <div class="wrapper">
            <Canvas ref="childRef" @handleHistory="handleHistory"></Canvas>
          </div>
          <TableControl ref="controlRef"></TableControl>
        </div>
        <div class="over" v-show="tabIdx == 1">
          <OverAll></OverAll>
        </div>
        <div class="relation" v-show="tabIdx == 2">
          <TaskRelation></TaskRelation>
        </div>
      </el-container>
    </el-container>
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
  canUndo: false,
  canRedo: false,
})

const checkTab = (index) => {
  tabIdx.value = index
}
const handleMenu = (val) => {
  if (val === '保存') {
    childRef.value.saveTaskDetail()
  } else if (val === '格式') {
    hide.value = !hide.value
    childRef.value.handleToolMenu(hide.value, val)
    stepMenuRef.value.handleToolMenu(hide.value, val)
    controlRef.value.handleToolMenu(hide.value, val)
  } else {
    childRef.value.handleToolMenu('none', val)
  }
}
const handleHistory = ({ canUndo, canRedo }) => {
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
.shape_header {
  border-radius: 3px;
}
.box{
  width: 100%;
  height: 100%;
  padding-left:8px;
  display: flex;
  flex-direction: column;
}
.wrapper {
  flex: 1 1;
  width: 100%;
  height: calc(100% - 214px);
  display: flex;
  overflow: hidden;
}
.over,
.relation {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  width: 100%;
  height: 100%;
}
.el-container-layout {
  width: 100%;
  height: calc(100% - 41px);
}
</style>
