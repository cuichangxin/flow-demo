<template>
  <div>
    <el-dialog
      v-bind="attrs"
      :model-value="props.modelValue"
      :show-close="false"
      :fullscreen="attrs?.fullscreen ?? isFullscreen"
      :width="props.width"
      :before-close="handleClose"
    >
      <template #header>
        <div>
          <span class="dialog-title">{{ props.title }}</span>
        </div>
        <div class="btns">
          <el-icon v-if="isFullScreenBtn" title="全屏" @click="handleFullscreen"><FullScreen /></el-icon>
          <el-icon @click="handleClose"><Close /></el-icon>
        </div>
      </template>

      <div class="content">
        <slot></slot>
      </div>
      <template #footer>
        <span v-if="!slots.footer" class="dialog-footer">
          <el-button type="primary" :disabled="props.disabled" @click="handleConfirm">{{ props.confirmText }}</el-button>
          <el-button @click="handleClose">{{ props.cancelText }}</el-button>
        </span>
        <slot v-else name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { Close, FullScreen } from '@element-plus/icons-vue'
import { useAttrs, useSlots, ref, computed } from 'vue'

const attrs = useAttrs()
const slots = useSlots()

interface PropType {
  title?: string
  modelValue?: boolean
  hiddenFullBtn?: boolean
  confirmText?:string,
  cancelText?:string,
  disabled?:boolean,
  width:string|number
}
const props = withDefaults(defineProps<PropType>(), {
  title: '',
  modelValue: false,
  hiddenFullBtn: true,
  confirmText:'确认',
  cancelText:'取消',
  disabled:false,
  width:'50%'
})
const emits = defineEmits<{
  (e: 'update:modelValue'): void
  (e: 'close'): void
  (e:'confirm'):void
}>()
// 当前是否全屏显示
const isFullscreen = ref(false)

const isFullScreenBtn = computed(() => {
  if (props.hiddenFullBtn) return false
  if (attrs?.fullscreen) return false
  return true
})
const handleFullscreen = () => {
  if (attrs?.fullscreen) return
  isFullscreen.value = !isFullscreen.value
}
const handleClose = () => {
  emits('close')
}
const handleConfirm = () => {
  emits('confirm')
}

defineExpose({
  isVisible:props.modelValue
})
</script>
<style lang="scss" scoped>
:deep(.el-dialog__header) {
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  margin: 0;
}
.dialog-title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
}
.btns {
  display: flex;
  align-items: center;
  i {
    margin-right: 8px;

    font-size: 16px;
    cursor: pointer;
  }
  i:last-child {
    margin-right: 0;
  }
}
</style>
