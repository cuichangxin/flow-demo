<template>
  <steps :isActive="1"></steps>
  <div class="config">
    <header class="header">配置信息</header>
    <el-form :model="configForm" label-position="right" label-width="120px" class="form">
      <el-form-item label="配置项名称">
        <el-input v-model="configForm.name"></el-input>
      </el-form-item>
      <el-form-item label="开发语言">
        <el-select v-model="configForm.codeLang">
          <el-option label="" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理器">
        <el-select v-model="configForm.processor">
          <el-option label="" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配置项描述">
        <el-input v-model="configForm.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
      </el-form-item>
      <el-form-item label="软件类型">
        <el-select v-model="configForm.type">
          <el-option label="" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="安全关键等级">
        <el-select v-model="configForm.level">
          <el-option label="" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划完成时间">
        <el-date-picker v-model="configForm.eTime" type="datetime" placeholder="Select date and time" />
      </el-form-item>
      <el-form-item>
        <el-button type="info" class="button">返回上一步</el-button>
        <el-button type="primary" @click="stepNext">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import steps from './common/steps.vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const configForm = ref({
  name: '',
  codeLang: '',
  processor: '',
  desc: '',
  type: '',
  level: '',
  eTime: ''
})
const stepNext = ()=>{
  router.push({
    path:'/pm/messageAffirm'
  })
}
</script>
<style lang="scss" scoped>
.config {
  height: calc(100% - 220px);
  background-color: #fff;
  margin: 30px 20px 0;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  height: 40px;
  width: 100%;
  background-color: #3572e3;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  line-height: 40px;
}

.form {
  margin-top: 40px;
  width: 50%;
}
.button{
  margin-right: 100px;
}
</style>
