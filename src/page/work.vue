<template>
  <Splitpanes class="default-theme">
    <pane>
      <demandAnalysis class="demand"></demandAnalysis>
    </pane>
    <pane>
      <div class="work">
      <shapeHeader
        class="shape_header"
        @handleMenu="handleMenu"
        :canRedo="history.canRedo"
        :canUndo="history.canUndo"
        :tabIdx="tabIdx"
      ></shapeHeader>
      <el-container class="el-container-layout">
        <StepMenu @checkTab="checkTab" :tabIdx="tabIdx" @openAI="openAI" ref="stepMenuRef"></StepMenu>
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
      <Dialog
        title="智能辅助"
        :hidden-full-btn="false"
        v-model="visible"
        @confirm="handleConfirm"
        @close="handleClose"
      ></Dialog>
    </div>
    </pane>
  </Splitpanes>
  <!-- <div class="wrap-split">
    <demandAnalysis class="demand"></demandAnalysis>
    <div class="work">
      <shapeHeader
        class="shape_header"
        @handleMenu="handleMenu"
        :canRedo="history.canRedo"
        :canUndo="history.canUndo"
        :tabIdx="tabIdx"
      ></shapeHeader>
      <el-container class="el-container-layout">
        <StepMenu @checkTab="checkTab" :tabIdx="tabIdx" @openAI="openAI" ref="stepMenuRef"></StepMenu>
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
      <Dialog
        title="智能辅助"
        :hidden-full-btn="false"
        v-model="visible"
        @confirm="handleConfirm"
        @close="handleClose"
      ></Dialog>
    </div>
  </div> -->
</template>
<script setup>
import StepMenu from '../components/business/work/stepMenu.vue'
import Canvas from '../components/business/work/midCanvas.vue'
import TableControl from '../components/business/work/taskControl.vue'
import OverAll from '../components/business/work/overAll.vue'
import TaskRelation from '../components/business/work/taskRelation.vue'
import shapeHeader from '../components/common/shapeHeader.vue'
import Dialog from '../components/common/dialog/dialog.vue'
import demandAnalysis from './demandAnalysis.vue'

import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import useDialog from '../hooks/useDialog'

const { visible: visible, openDialog: openDialog, closeDialog: closeDialog } = useDialog()

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
const handleConfirm = () => {
  closeDialog()
}
const handleClose = () => {
  closeDialog()
}
const openAI = () => {
  openDialog()
}
</script>
<style lang="scss" scoped>
.wrap-split{
  height: calc(100% - 66px);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.demand{
  width: 100%;
  height: 100%;
  margin: 0 0 0 8px;
}
.draw{
  width: 10px;
  height: 30px;
  background-color: #6d6b6b;
  border-radius: 5px;
}
.work {
  width: calc(100% - 8px);
  height: 100%;
  margin: 0 8px 0 0;
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
.box {
  width: 100%;
  height: 100%;
  padding-left: 8px;
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
:deep(.splitpanes__splitter){
  background-color: #e9f1f6 !important;
}
.splitpanes{
  height: calc(100% - 65px);
}
</style>
