<template>
  <div class="flow-editor-collapse">
    <div class="flow-editor-collapse-wrapper">
      <div class="flow-json-schema-form-body">
        <div class="tabs">设置</div>
        <el-form :model="flowForm" class="flow-editor-form">
          <div class="type-title">内容</div>
          <el-form-item class="form-item border" label="标题">
            <el-input size="small" v-model="flowForm.label"></el-input>
          </el-form-item>
          <div class="type-title">样式</div>
          <el-form-item class="form-item" label="位置">
            <el-input size="small" v-model="flowForm.label"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="flow-editor-icon">
        <el-icon><DArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import { DArrowRight } from '@element-plus/icons-vue'

const flowForm = ref({
  label:''
})
</script>
<style lang="scss" scoped>
.flow-editor-collapse{
  position: absolute;
  width: 200px;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.85);
  font-size: 12px;
  transition: right .5s;
  border-left: 1px solid #d9d9d9;
}
.flow-editor-collapse-wrapper{
  position: absolute;
  width: 200px;
  top: 0;
  right: 0;
  bottom: 0;
  transition: left .5s;
}
.flow-json-schema-form-body{
  position: absolute;
  inset:  0px 0px 40px;
}
.flow-editor-icon{
  position: absolute;
  top: 10px;
  left: -19px;
  background-color: #fff;
  width: 20px;
  height: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
}
.tabs{
  height: 40px;
  border-bottom: 1px solid #d9d9d9;
  text-align: center;
  line-height: 40px;
  box-shadow: 0 0 16px -5px rgba(0,0,0,.2);
  font-size: 13px;
  color: #225ceb;
  font-weight: 600;
}
.flow-editor-form{
  padding: 10px;
}
.type-title{
  margin-top: 18px;
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
:deep(.form-item){
  .el-form-item__label{
    color: rgba(0,0,0,.45);
    font-size: 12px;
    font-weight: normal;
  }
}
.border{
  border-bottom: 1px solid #ccc;
  padding-bottom: 14px;
}
</style>
