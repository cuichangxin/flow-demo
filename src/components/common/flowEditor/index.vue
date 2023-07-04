<template>
  <div class="flow-editor-collapse" ref="collapseRef" :style="{ right: isCollapse ? '-220px' : '' }">
    <div class="flow-editor-collapse-wrapper">
      <div class="flow-json-schema-form-body">
        <div class="tabs">设置</div>
        <el-scrollbar :height="formHeight">
          <el-form :model="flowForm" class="flow-editor-form">
            <div class="type-title">内容</div>
            <el-form-item class="form-item border" label="标题" prop>
              <el-input size="small" v-model="flowForm.label"></el-input>
            </el-form-item>
            <div class="type-title">样式</div>
            <el-form-item class="form-item location" label="位置">
              <el-input-number
                size="small"
                style="width: 70px"
                controls-position="right"
                v-model="flowForm.x"
              ></el-input-number>
              <span>x</span>
              <el-input-number
                size="small"
                style="width: 70px"
                controls-position="right"
                v-model="flowForm.y"
              ></el-input-number>
              <span>y</span>
            </el-form-item>
            <el-form-item class="form-item location" label="尺寸">
              <el-input-number
                size="small"
                style="width: 70px"
                controls-position="right"
                v-model="flowForm.width"
              ></el-input-number>
              <span>w</span>
              <el-input-number
                size="small"
                style="width: 70px"
                controls-position="right"
                v-model="flowForm.height"
              ></el-input-number>
              <span>h</span>
            </el-form-item>
            <el-form-item class="form-item" label="填充">
              <el-color-picker v-model="flowForm.fill" show-alpha size="small" :predefine="predefineColors" />
            </el-form-item>
            <el-form-item class="form-item" label="边框">
              <el-color-picker v-model="flowForm.stroke" show-alpha size="small" :predefine="predefineColors" />
            </el-form-item>
            <el-form-item class="form-item location flex-start" label="字号">
              <el-input-number
                size="small"
                style="width: 100px; margin-right: 5px"
                controls-position="right"
                v-model="flowForm.fontsize"
              ></el-input-number>
              <el-color-picker v-model="flowForm.color" show-alpha size="small" :predefine="predefineColors" />
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <div class="flow-json-schema-form-footer"></div>
      <div
        class="flow-editor-icon"
        :style="{
          borderRadius: isCollapse ? '50% 0px 0px 50%' : '',
          left: isCollapse ? '-19px' : '',
        }"
        @click="collapse"
      >
        <el-icon :style="{ transform: isCollapse ? 'rotate(180deg)' : '' }"><DArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import { DArrowRight } from '@element-plus/icons-vue'

const isCollapse = ref(false)
const flowForm = ref({
  label: '',
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  fill: 'rgba(34,25,77,1)',
  stroke: '',
  fontsize: 12,
  color: '',
})
const collapseRef = ref(null)
const formHeight = ref(0)
const predefineColors = ref([
  '#D0021B',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF',
])
const collapse = () => {
  isCollapse.value = !isCollapse.value
}
onMounted(()=>{
  formHeight.value = collapseRef.value.offsetHeight
  window.addEventListener('resize', ()=>{
    formHeight.value = collapseRef.value.offsetHeight - 58
  })
})
onBeforeUnmount(()=>{
  window.removeEventListener('resize',()=>{})
})
</script>
<style lang="scss" scoped>
.flow-editor-collapse {
  position: absolute;
  width: 220px;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.85);
  font-size: 12px;
  transition: right 0.5s;
}
.flow-editor-collapse-wrapper {
  position: absolute;
  width: 220px;
  top: 0;
  right: 0;
  bottom: 0;
  transition: left 0.5s;
  border-left: 1px solid #d9d9d9;
}
.flow-json-schema-form-body {
  position: absolute;
  inset: 0px 0px 40px;
  width: 100%;
  height: 100%;
}
.flow-json-schema-form-footer {
  position: absolute;
  left: 0;
  right: 0;
  line-height: 40px;
  height: 40px;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: space-evenly;
  background: #fff;
  border-top: 1px solid #d9d9d9;
}
.flow-editor-icon {
  position: absolute;
  top: 10px;
  left: -10px;
  background-color: #fff;
  width: 20px;
  height: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  &:hover {
    .el-icon {
      color: #225ceb;
      transition: 0.3s all;
    }
  }
}
.tabs {
  height: 40px;
  border-bottom: 1px solid #d9d9d9;
  text-align: center;
  line-height: 40px;
  box-shadow: 0 0 16px -5px rgba(0, 0, 0, 0.2);
  font-size: 13px;
  color: #225ceb;
  font-weight: 600;
}
.flow-editor-form {
  height: 100%;
  padding: 10px;
  max-height: 500px;
}
.type-title {
  margin-top: 18px;
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
:deep(.form-item) {
  .el-form-item__label {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    font-weight: normal;
  }
  .el-input-number.is-controls-right .el-input__wrapper {
    padding-left: 0;
    padding-right: 25px;
  }
}
:deep(.location) {
  .el-form-item__content {
    justify-content: space-between;
  }
}
:deep(.flex-start) {
  .el-form-item__content {
    justify-content: flex-start;
  }
}
.border {
  border-bottom: 1px solid #ccc;
  padding-bottom: 14px;
}
</style>
