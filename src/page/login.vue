<template>
  <div class="login-info">
    <div class="login-wrapper">
      <header class="header-info">
        <img class="logo" src="../assets/images/login-logo.png" />
        <span class="title">航天软件智能生产线</span>
      </header>
      <section class="main">
        <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入账号" class="input" @keyup.enter="goPwd">
              <template #prefix>
                <i class="iconfont icon icon-renyuan"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              show-password
              class="input"
              ref="pwdRef"
              @keyup.enter="login"
            >
              <template #prefix>
                <i class="iconfont icon icon-24gf-lock2"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="button" type="primary" @click="login">
              <span v-if="!loading">登 录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
        </el-form>
        <div class="other">
          <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
          <div class="register">立即注册</div>
          <div class="forget">忘记密码？</div>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'

const router = useRouter()

const { proxy } = getCurrentInstance()

const pwdRef = ref(null)
const loading = ref(false)
const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false,
})

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
}

const login = () => {
  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      loading.value = true
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set('username', loginForm.value.username, { expires: 30 })
        Cookies.set('password', encrypt(loginForm.value.password), { expires: 30 })
        Cookies.set('rememberMe', loginForm.value.rememberMe, { expires: 30 })
      } else {
        // 否则移出
        Cookies.remove('username')
        Cookies.remove('password')
        Cookies.remove('rememberMe')
      }
      // 调用登录接口
      proxy.$axios
        .userLogin({
          userName: loginForm.value.username,
          userPwd: loginForm.value.password,
        })
        .then((res) => {
          if (res.code === 200) {
            Cookies.set('roleId', res.data.roleId, { expires: 30 })
            Cookies.set('userName', res.data.userName, { expires: 30 })
            Cookies.set('userId', res.data.roleDes.id, { expires: 30 })
            Cookies.set('typeId', res.data.typeId, { expires: 30 })
            if (res.data.roleId === '7') {
              router.push({ name: 'testRecord' })
            } else {
              router.push({ name: 'index' })
            }
          } else {
            proxy.$modal.msgError(res.msg)
            loading.value = false
          }
        })
        .catch((err) => {
          loading.value = false
        })
    }
  })
}
function getCookie() {
  const username = Cookies.get('username')
  const passwords = Cookies.get('password')
  const rememberMes = Cookies.get('rememberMe')
  loginForm.value.username = username === undefined ? loginForm.value.username : username
  loginForm.value.password = passwords === undefined ? loginForm.value.password : decrypt(passwords)
  loginForm.value.rememberMe = rememberMes === undefined ? loginForm.value.rememberMe : Boolean(rememberMes)
}
getCookie()
const goPwd = () => {
  if (loginForm.value.username.length && loginForm.value.password === '') {
    pwdRef.value.focus()
  }
}
</script>
<style lang="scss" scoped>
.login-info {
  width: 100%;
  height: 100%;
  background: url('../assets/images/login-bg.jpeg') no-repeat;
  background-size: 100% 100%;
  position: relative;
}

.login-wrapper {
  width: 400px;
  height: 440px;
  background-color: var(--my-bg-color);
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  position: absolute;
  right: 160px;
  bottom: 50%;
  transform: translateY(50%);
}

.header-info {
  padding: 30px 20px 20px;
  display: flex;
  align-items: center;

  .logo {
    width: 35px;
    height: 35px;
    margin-left: 10px;
  }

  .title {
    font-size: 27px;
    font-weight: bold;
    color: var(--el-text-color-regular);
    margin-left: 20px;
  }
}

.main {
  margin-top: 30px;
  padding: 0 40px 40px;

  .input {
    width: 100%;
    height: 45px;
  }
  .button {
    width: 100%;
    height: 45px;
    font-size: 17px;
    border-radius: 40px;
  }
}

.icon {
  font-size: 18px;
  color: var(--el-text-color-regular);
}
.other {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  .register,
  .forget {
    font-size: 14px;
    color: var(--el-text-color-regular);
    font-weight: 500;
    height: 32px;
    margin: 0 0 25px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
}
:deep(.el-form-item) {
  margin-bottom: 40px;
}
</style>
