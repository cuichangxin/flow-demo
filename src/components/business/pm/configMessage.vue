<template>
  <div class="config_message_info">
    <steps :isActive="1"></steps>
    <div class="config" :style="{ height: `${configHeight}px` }">
      <header class="header">配置信息</header>
      <el-form :model="configForm" label-position="right" label-width="120px" class="form" ref="configFormRef">
        <el-form-item label="配置项名称" required prop="name">
          <el-input v-model="configForm.name"></el-input>
        </el-form-item>
        <el-form-item label="开发语言" required prop="codeLang">
          <el-select v-model="configForm.codeLang">
            <el-option v-for="item in codeLangList" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理器" required prop="processor">
          <el-select v-model="configForm.processor">
            <el-option v-for="item in processorList" :key="item.label" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置项描述" required prop="desc">
          <el-input v-model="configForm.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
        <el-form-item label="软件类型" required prop="type">
          <el-select v-model="configForm.type">
            <el-option v-for="item in typeList" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安全关键等级" required prop="level">
          <el-select v-model="configForm.level">
            <el-option v-for="item in levelList" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划完成时间" required prop="eTime">
          <el-date-picker v-model="configForm.eTime" type="date" placeholder="Select date and time" />
        </el-form-item>
        <el-form-item>
          <el-button type="info" class="button" @click="goBack">返回上一步</el-button>
          <el-button type="primary" @click="stepNext">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import steps from './common/steps.vue'
import { allStore } from '../../../store';

const store = allStore()
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
const configFormRef = ref(null)
const configHeight = ref(0)
// 开发语言下拉菜单
const codeLangList = reactive([
  {
    label: 'C语言',
    value: 1
  },
  {
    label: 'FPGA',
    value: 2
  },
  {
    label: 'C++',
    value: 3
  },
])
// 处理器下拉菜单
const processorList = reactive([
  {
    label: 'BM3803',
    value: 1
  },
  {
    label: 'BM3105',
    value: 2
  },
  {
    label: 'VC33',
    value: 3
  },
  {
    label: 'DSP6713',
    value: 4
  },
])
// 软件类型下拉菜单
const typeList = reactive([
  {
    label: '火箭飞控软件',
    value: 1
  },
  {
    label: '综控器监控软件',
    value: 2
  },
  {
    label: 'GNCC软件',
    value: 3
  },
  {
    label: '卫星星务',
    value: 4
  },
  {
    label: '应用软件',
    value: 5
  },
])
// 安全关键等级下拉菜单
const levelList = reactive([
  {
    label: 'A级',
    value: 1
  },
  {
    label: 'B级',
    value: 2
  },
  {
    label: 'C级',
    value: 3
  },
  {
    label: 'D级',
    value: 4
  },
])

const stepNext = () => {
  configFormRef.value.validate((valid) => {
    if (valid) {
      store.projectInfo = configForm.value
      router.push({
        name: 'messageAffirm'
      })
    } else {
      console.log('error submit');
    }
  })
}
const goBack = () => {
  router.go(-1)
}
onMounted(() => {
  configHeight.value = window.innerHeight - 255
  window.addEventListener('resize', () => {
    configHeight.value = window.innerHeight - 255
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => { })
})
</script>
<style lang="scss" scoped>
.config_message_info{
  width: 100%;
  height: 100%;
}
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

.button {
  margin-right: 100px;
}
</style>
