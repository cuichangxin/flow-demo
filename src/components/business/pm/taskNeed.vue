<template>
  <div class="task_need_info">
    <steps :isActive="0"></steps>
    <div class="upload">
      <h4>导入任务需求</h4>
      <el-upload 
        drag
        :action="uploadFileUrl"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        class="upload-el">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处或 <em>单击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请选择大小小于{{fileInfo.fileSize}}MB的{{fileInfo.fileType.join('/')}}文件
          </div>
        </template>
      </el-upload>
      <el-button class="button" type="primary" @click="stepNext">下一步</el-button>
    </div>
  </div>
</template>
<script setup>
import steps from './common/steps.vue'
import { UploadFilled } from '@element-plus/icons-vue'

const router = useRouter()
const { proxy } = getCurrentInstance()

const stepNext = () => {
  router.push({
    path: '/pm/configMessage'
  })
}
const fileInfo = reactive({
  fileSize: 500,
  fileType: ['word', 'pdf', 'SysML']
})
// const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + '123') // 上传文件的地址
const uploadFileUrl = ref('https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15')

function handleBeforeUpload(file) {
  // 校检文件类型
  if (fileInfo.fileType.length) {
    const fileName = file.name.split('.')
    const fileExt = fileName[fileName.length - 1]
    const isTypeOk = fileInfo.fileType.indexOf(fileExt) >= 0
    if (!isTypeOk) {
      proxy.$modal.msgError(`文件格式不正确, 请上传${fileInfo.fileType.join("/")}格式文件!`);
      return false;
    }
  }
  // 校检文件大小
  if (fileInfo.fileSize) {
    const isLt = file.size / 1024 / 1024 < fileInfo.fileSize
    if (!isLt) {
      proxy.$modal.msgError(`上传文件大小不能超过 ${fileInfo.fileSize} MB!`);
      return false;
    }
  }
  proxy.$modal.loading("正在上传文件，请稍候...");
  return true;
}
// 上传成功回调
function handleUploadSuccess(res, file) {
  // if (res.code === 200) {
  //   proxy.$modal.msgSuccess('上传成功！')
  // } else {
  //   proxy.$modal.closeLoading()
  //   proxy.$modal.msgError(res.msg)
  // }
  proxy.$modal.msgSuccess('上传成功！')
  proxy.$modal.closeLoading()
}
// 上传失败
function handleUploadError(err) {
  proxy.$modal.msgError("上传文件失败")
  proxy.$modal.closeLoading()
}

</script>
<style lang="scss" scoped>
.task_need_info {
  width: 100%;
  height: 100%;
}

.upload {
  background-color: var(--header-bg-color);
  padding: 0 15px 15px;
  border-radius: 4px;
  border: 1px dashed var(--el-border-color);
  margin-top: 10px;
  .button {
    margin: 20px 5px 0 0;
  }
}
</style>
