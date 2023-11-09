<template>
  <div class="work" :style="{ height: `${configHeight}px` }">
    <shapeHeader
      class="shape_header"
      @handleMenu="handleMenu"
      :canRedo="history.canRedo"
      :canUndo="history.canUndo"
      :tabIdx="tabIdx"
    ></shapeHeader>
    <Splitpanes class="default-theme" @resize="paneSize">
      <pane :size="showWord ? 45 : 0" class="pane">
        <div class="docx"></div>
      </pane>
      <pane :size="showWord ? 55 : 100">
        <el-container class="el-container-layout">
          <StepMenu @checkTab="checkTab" :tabIdx="tabIdx" ref="stepMenuRef"></StepMenu>
          <el-container>
            <div class="box" :class="{ center: !autoCreate }" v-show="tabIdx == 0">
              <div v-if="autoCreate" class="flex-box">
                <div class="wrapper">
                  <Canvas ref="childRef" @handleHistory="handleHistory"></Canvas>
                </div>
                <TableControl ref="controlRef"></TableControl>
              </div>
              <el-button v-else class="button" type="primary" @click="addProject">自动生成架构设计</el-button>
            </div>
            <div class="over" v-show="tabIdx == 1">
              <OverAll></OverAll>
            </div>
            <div class="relation" v-show="tabIdx == 2">
              <TaskRelation ref="relationRef"></TaskRelation>
            </div>
          </el-container>
        </el-container>
      </pane>
    </Splitpanes>
    <el-dialog v-model="isAuto" width="30%">
      <el-form>
        <el-form-item v-if="nextStep === 1" label="架构设计模板">
          <el-select v-model="autoInfo.template">
            <el-option v-for="item in autoList.template" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="nextStep === 2" label="应用任务模型">
          <el-checkbox v-model="autoInfo.model" label="数据采集功能是否包含在综合控制模块" />
        </el-form-item>
        <el-form-item v-if="nextStep === 3" label="安全性">
          <el-select v-model="autoInfo.security">
            <el-option v-for="item in autoList.security" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-if="nextStep === 4">
          <el-form-item label="架构设计模版">
            {{ autoInfo.template }}
          </el-form-item>
          <el-form-item label="应用任务模型">
            <el-checkbox disabled v-model="autoInfo.model" label="数据采集功能是否包含在综合控制模块" />
          </el-form-item>
          <el-form-item label="安全性">
            {{ autoInfo.security }}
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="nextAuto">{{ nextStep === 4 ? '确认' : '下一步' }}</el-button>
        </span>
      </template>
    </el-dialog>
    <Dialog
      title="总体建议"
      :hidden-full-btn="false"
      :width="600"
      v-model="visible"
      @confirm="handleConfirm"
      @close="handleClose"
    >
      <p>通过对本文档的分析解读，以及和历史案例的对照，我们有以下建议：</p>
      <p style="margin-left: 10px">
        1.目前各项任务的优先级都是同样的值，通常情况下这是不准确的。请对不同任务指定不同的优先级。
      </p>
      <p style="margin-left: 10px">2.系统缺少对异常情况的处理描述，请补充说明。</p>
    </Dialog>
  </div>
</template>
<script setup>
import StepMenu from '../components/business/work/stepMenu.vue'
import Canvas from '../components/business/work/midCanvas.vue'
import TableControl from '../components/business/work/taskControl.vue'
import OverAll from '../components/business/work/overAll.vue'
import TaskRelation from '../components/business/work/taskRelation.vue'
import shapeHeader from '../components/common/shapeHeader.vue'
import Dialog from '../components/common/dialog/dialog.vue'
import useDialog from '../hooks/useDialog'

import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { renderAsync } from 'docx-preview'
import { nextTick } from 'vue'
import Axios from 'axios'

const { visible: visible, openDialog: openDialog, closeDialog: closeDialog } = useDialog()

const tabIdx = ref(0)
const childRef = ref(null)
const stepMenuRef = ref(null)
const controlRef = ref(null)
const relationRef = ref(null)
const hide = ref(false)
const history = reactive({
  canUndo: false,
  canRedo: false,
})
const showWord = ref(true)
const autoCreate = ref(false)
const isAuto = ref(false)
const nextStep = ref(1)
const autoInfo = ref({
  template: '',
  model: false,
  security: '',
})
const autoList = reactive({
  template: [
    {
      label: '长征5号',
      value: '长征5号',
    },
    {
      label: '长征7号',
      value: '长征7号',
    },
  ],
  security: [
    {
      label: '1选1',
      value: '1选1',
    },
    {
      label: '2选1',
      value: '2选1',
    },
    {
      label: '3选1',
      value: '3选1',
    },
    {
      label: '3选2',
      value: '3选2',
    },
    {
      label: '5选3',
      value: '5选3',
    },
    {
      label: '5选4',
      value: '5选4',
    },
  ],
})
const configHeight = ref('')

const nextAuto = () => {
  if (nextStep.value < 4) {
    nextStep.value++
  } else {
    autoCreate.value = true
    isAuto.value = false
    nextStep.value = 1
    nextTick(() => {
      childRef.value.handleCreate(autoInfo.value)
    })
    localStorage.setItem(
      'isWorkAuto',
      JSON.stringify({
        isAuto: autoCreate.value,
        model: autoInfo.value.model,
      })
    )
  }
}
const cancel = () => {
  isAuto.value = false
  nextStep.value = 1
}
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
  } else if (val === '视图对照') {
    showWord.value = !showWord.value
    childRef.value.handleToolMenu('resize')
  } else if (val === '智能辅助') {
    relationRef.value.handleToolMenu('none', val)
  } else if (val === '智能验证') {
    openSuggest()
    relationRef.value.handleToolMenu('none', val)
  } else {
    childRef.value.handleToolMenu('none', val)
    controlRef.value.handleToolMenu('none', val)
    relationRef.value.handleToolMenu('none', val)
  }
}

const openSuggest = (scope) => {
  openDialog()
}
const handleConfirm = () => {
  closeDialog()
}
const handleClose = () => {
  closeDialog()
}

const handleHistory = ({ canUndo, canRedo }) => {
  history.canUndo = canUndo
  history.canRedo = canRedo
}

const paneSize = (e) => {
  childRef.value.handleToolMenu('resize')
}

const addProject = () => {
  isAuto.value = !isAuto.value
}
function previewFile() {
  nextTick(() => {
    Axios.get('/mock/word/1.docx',{ responseType: 'blob' }).then((response) => {
        const html = document.getElementsByClassName('docx')
        renderAsync(response.data, html[0]).then((res) => {
          console.log('res---->', res)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  })
}
previewFile()
onMounted(() => {
  const isWorkAuto = localStorage.getItem('isWorkAuto')
  if (JSON.parse(isWorkAuto) !== null && JSON.parse(isWorkAuto).isAuto) {
    autoCreate.value = true
    nextTick(() => {
      childRef.value.handleCreate(JSON.parse(isWorkAuto))
    })
  }
  configHeight.value = window.innerHeight - 140
  window.addEventListener('resize', () => {
    configHeight.value = window.innerHeight - 140
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>
<style lang="scss" scoped>
.wrap-split {
  height: calc(100% - 66px);
  width: 100%;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.demand {
  width: 100%;
  height: 100%;
  margin: 0 0 0 8px;
}
.draw {
  width: 10px;
  height: 30px;
  background-color: #6d6b6b;
  border-radius: 5px;
}
.work {
  /* height: calc(100% - 65px); */
  margin: 0 auto;
  overflow: hidden;
  flex-wrap: wrap;
  align-content: flex-start;
  /* background-color: #f4f4f4; */
  border-radius: 4px;
}
.shape_header {
  border-radius: 3px;
}
.box {
  width: 100%;
  height: 100%;
  border-left: 1px solid var(--el-border-color);
  background-color: var(--my-bg-color);
  .flex-box {
    width: 100%;
    height: 100%;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    background-color: var(--my-bg-color-3);
  }
  &.center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
  width: 100%;
  height: 100%;
  background-color: var(--my-bg-color-5);
}
.el-container-layout {
  width: 100%;
  height: calc(100% - 40px);
}
:deep(.splitpanes__splitter) {
  background-color: #e9f1f6 !important;
}
:deep(.docx-wrapper > section.docx) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
.show_word {
  width: 0 !important;
}
:deep(.splitpanes.default-theme .splitpanes__pane) {
  /* background-color: var(--my-bg-color-4); */
}
:deep(.splitpanes__splitter) {
  background-color: #e9f1f6 !important;
}
.splitpanes {
  height: 100%;
}
:deep(.docx-wrapper) {
  background-color: var(--my-bg-color-4);
}
:deep(.docx-wrapper > section.docx) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  background-color: var(--my-bg-color);
}
:deep(.splitpanes__splitter) {
  background-color: var(--my-bg-color-2) !important;
  border-left: 1px solid var(--el-border-color) !important;
}
:deep(.splitpanes.default-theme .splitpanes__splitter:before),
:deep(.splitpanes.default-theme .splitpanes__splitter:after) {
  background-color: var(--my-text-bg-color-5);
}
:deep(.docx) {
  color: var(--my-text-bg-color-3);
}
:deep(.docx span) {
  color: var(--my-text-bg-color-3) !important;
  background-color: transparent !important;
}
:deep(.docx-wrapper > section.docx) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
.pane {
  overflow: auto;
}
aside{
  border-radius: 0;
}
</style>
