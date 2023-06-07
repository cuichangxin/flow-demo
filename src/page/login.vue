<template>
  <div class="login-info">
    <div class="login-wrapper">
      <header class="header-info">
        <img class="logo" src="../assets/image/login-logo.png" />
        <span class="title">航天软件智能生产线</span>
      </header>
      <section class="main">
        <el-input v-model="idNumber" class="input">
          <template #prefix>
            <i class="iconfont icon icon-renyuan"></i>
          </template>
        </el-input>
        <el-input v-model="password" show-password class="input">
          <template #prefix>
            <i class="iconfont icon icon-24gf-lock2"></i>
          </template>
        </el-input>
        <el-button class="button" type="primary" @click="login">登 录</el-button>
        <div class="other">
          <el-checkbox v-model="rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
          <div class="register">立即注册</div>
          <div class="forget">忘记密码？</div>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
import Cookies from 'js-cookie'
import { encrypt, decrypt } from "@/utils/jsencrypt";

const router = useRouter()

const { proxy } = getCurrentInstance()
const idNumber = ref('')
const password = ref('')
const rememberMe = ref(false)


const login = () => {
  proxy.$axios.userLogin({
    userName: idNumber.value,
    userPwd: password.value
  }).then((res) => {
    // 记住密码
    if (rememberMe.value) {
      Cookies.set('idNumber',idNumber.value,{expires:30})
      Cookies.set('password', encrypt(password.value),{ expires: 30 })
      Cookies.set('rememberMe',rememberMe.value,{expires:30})
    }else {
      Cookies.remove('idNumber')
      Cookies.remove('password')
      Cookies.remove('rememberMe')
    }
    Cookies.set('roleId', res.data.roleId,{ expires: 30 })
    Cookies.set('userName', res.data.userName,{ expires: 30 })
    Cookies.set('userId', res.data.roleDes.id,{ expires: 30 })
    if (res.data.roleId === '7') {
      router.push({name: 'testRecord'})
    }else {
      router.push({name: 'index'})
    }
  })
}
function getCookie() {
  const username = Cookies.get("idNumber");
  const passwords = Cookies.get("password");
  const rememberMes = Cookies.get("rememberMe");
  idNumber.value = username === undefined ? idNumber.value : username
  password.value = passwords === undefined ? password.value : decrypt(passwords)
  rememberMe.value = rememberMes === undefined ? rememberMe.value : Boolean(rememberMes)
}
getCookie()
</script>
<style lang="scss" scoped>
.login-info {
  width: 100%;
  height: 100%;
  background: url('../assets/image/login-bg.jpeg') no-repeat;
  background-size: 100% 100%;
  position: relative;
}

.login-wrapper {
  width: 460px;
  height: 440px;
  background-color: #f2f5fc;
  border-radius: 10px;
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.6);
  position: absolute;
  right: 100px;
  bottom: 50%;
  transform: translateY(50%);
}

.header-info {
  padding: 20px;
  display: flex;
  align-items: center;

  .logo {
    width: 40px;
    height: 40px;
  }

  .title {
    font-size: 33px;
    font-weight: bold;
    color: #67686a;
    margin-left: 20px;
  }
}

.main {
  margin-top: 40px;
  padding: 0 40px 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .input {
    width: 90%;
    height: 50px;
    margin-bottom: 30px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 10px;
  }

  .button {
    width: 90%;
    height: 50px;
    font-size: 20px;
    border-radius: 10px;
    margin-top: 20px;
  }
}

.icon {
  font-size: 18px;
  color: #67686a;
}
.other {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  .register,
  .forget {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
    height: 32px;
    margin: 0 0 25px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
