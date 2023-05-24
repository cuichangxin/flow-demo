<template>
  <steps :isActive="0"></steps>
  <div class="upload">
    <h1>导入任务需求</h1>
    <el-upload drag accept=".word,.pdf,.SysML" class="upload-el">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处或 <em>单击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          请选择大小小于500MB的SysML/word/pdf文件
        </div>
      </template>
    </el-upload>
    <el-button class="button" type="primary" @click="stepNext">下一步</el-button>
  </div>
</template>
<script setup>
import steps from './common/steps.vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const stepNext = ()=> {
  router.push({
    path:'/pm/configMessage'
  })
}

</script>
<style lang="scss" scoped>
.upload {
  height: calc(100% - 220px);
  background-color: #fff;
  padding: 0 15px 15px;
  margin: 50px 20px 0;
  border-radius: 2px;
  border: 3px dashed #e6e6e6;
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 22px;
    margin-left: 60px;
  }
  .button{
    width: 100px;
    height: 40px;
    font-size: 17px;
    float: right;
    margin: 20px 300px 0 0;
  }
}
.upload-el{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
:deep(.el-upload){
  width: 60%;
}
.el-upload__text{
  font-size: 17px;
}
.el-upload__tip{
  font-size: 15px;
  color: #333;
  font-weight: bold;
}
</style>
