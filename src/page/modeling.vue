<script setup>
import DesignMenu from '../components/business/model/designMenu.vue'
import ModelCanvas from '../components/business/model/modelCanvas.vue'
import ModelTable from '../components/business/model/modelTable.vue'
import shapeHeader from '../components/common/shapeHeader.vue'
import Dialog from '../components/common/dialog/dialog.vue'
import useDialog from '../hooks/useDialog'
import UseModelMenu from '../components/business/model/useModelMenu.vue'

import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { renderAsync } from 'docx-preview'
import axios from 'axios'
const { visible: visible, openDialog: openDialog, closeDialog: closeDialog } = useDialog()
const { proxy } = getCurrentInstance()

proxy.$bus.on('*', (name, val) => {
  if (name === 'undoAndRedo') {
    canUndo.value = val.canUndo
    canRedo.value = val.canRedo
  }
})

const configHeight = ref('')
const canUndo = ref(false) // 是否能撤销
const canRedo = ref(false) // 是否能重做
const showWord = ref(true)

onMounted(() => {
  configHeight.value = window.innerHeight - 130
  window.addEventListener('resize', () => {
    configHeight.value = window.innerHeight - 130
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})

const contractionFlag = ref(false)
const handleMenu = (val) => {
  console.log(val)
  if (val === '保存') {
    proxy.$bus.emit('saveFile')
  }
  if (val === '撤销') {
    proxy.$bus.emit('undo')
  }
  if (val === '重做') {
    proxy.$bus.emit('redo')
  }
  if (val === '格式') {
    contractionFlag.value = !contractionFlag.value
    proxy.$bus.emit('contraction', contractionFlag.value)
  }
  if (val === '缩略图') {
    proxy.$bus.emit('minimap')
  }
  if (val === '智能辅助') {
    proxy.$bus.emit('showAi')
  }
  if (val === '重新生成') {
    proxy.$bus.emit('regen')
  }
  if (val === '视图对照') {
    showWord.value = !showWord.value
  }
}
const handleConfirm = () => {
  closeDialog()
}
const handleClose = () => {
  closeDialog()
}
function previewFile() {
  nextTick(() => {
    axios
      .get('/mock/word/2.docx', { responseType: 'blob' })
      .then((response) => {
        const html = document.getElementsByClassName('docx')
        renderAsync(response, html[0]).then((res) => {
          // console.log('res---->', res)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  })
}
previewFile()
</script>
<template>
  <div class="modeling" :style="{ height: `${configHeight}px` }">
    <shapeHeader @handleMenu="handleMenu" :canRedo="canRedo" :canUndo="canUndo"></shapeHeader>
    <Splitpanes class="default-theme">
      <pane :size="showWord ? 35 : 0" class="pane">
        <div class="docx"></div>
      </pane>
      <pane :size="showWord ? 65 : 100">
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
      </pane>
    </Splitpanes>
    <Dialog
      :width="'40%'"
      title="智能辅助"
      :hidden-full-btn="false"
      v-model="visible"
      @confirm="handleConfirm"
      @close="handleClose"
    ></Dialog>
  </div>
</template>
<style lang="scss" scoped>
.modeling {
  background: #f4f4f4;
  position: relative;
}
.container {
  /* height: calc(100% - 40px); */
  height: 100%;
}

.main_info {
  height: 100%;
  padding: 0 0 2px 10px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  transition: height 0.2s linear;

  .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-width: 0;
  }
}
.splitpanes {
  height: calc(100% - 40px);
}
.splitpanes__pane {
  border-radius: 3px;
}
.show_word {
  width: 0 !important;
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
  background-color: var(--my-bg-color-4) !important;
  border-left: 1px solid var(--el-border-color) !important;
}
:deep(.splitpanes.default-theme .splitpanes__pane) {
  background-color: var(--my-bg-color-5);
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
</style>
