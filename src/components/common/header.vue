<template>
  <el-header class="header" :class="{ fade: isOut }">
    <div v-if="!isOut" class="title_box">
      <img class="logo" src="../../assets/image/login-logo.png" />
      <h2>航天软件智能生产线</h2>
    </div>
    <p v-if="!isOut" class="user_info">
      <el-dropdown trigger="click" @command="handleDrop">
        <span class="user">
          <el-avatar class="avatar" :src="state.avatarUrl" :size="32" />
          <div class="user_role">
            <span>{{ userInfo.userName }}</span>
            <span class="role--span">{{ USERROLE[Cookies.get('roleId')] }}</span>
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="dropdown-menu">
            <el-dropdown-item command="1">
              <i class="iconfont icon-tuichu"></i>
              退出登录
            </el-dropdown-item>
            <el-dropdown-item command="2">
              <i class="iconfont icon-24gf-lock2"></i>
              设置密码
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </p>
    <mark-poiner :isOut="isOut" :direction="'bottom'" @hideMenu="hideMenu" color="#fff"></mark-poiner>
  </el-header>
</template>
<script setup>
import markPoiner from '../common/mark/markPoiner.vue'
import Cookies from 'js-cookie'
import { USERROLE } from '../../utils/map'

const instance = getCurrentInstance()
const router = useRouter()
const userInfo = ref({
  userName: Cookies.get('userName'),
})

const hideMenu = (val) => {
  isOut.value = val
  instance.proxy.$bus.emit('resize', isOut.value)
}
const isOut = ref(false)
const state = reactive({
  avatarUrl: new URL('../../assets/image/avator.png', import.meta.url).href,
  size: '',
})

const handleDrop = (command) => {
  if (command === '1') {
    const rememberMe = Cookies.get('rememberMe')
    if (Boolean(rememberMe)) {
      Cookies.remove('userId')
      Cookies.remove('userName')
      Cookies.remove('roleId')
      Cookies.remove('taskId')
    } else {
      Cookies.remove('userId')
      Cookies.remove('password')
      Cookies.remove('userName')
      Cookies.remove('roleId')
      Cookies.remove('taskId')
    }
    router.push({
      path: '/login',
    })
  }
  if (command === '2') {
    console.log('set')
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  position: relative;
  border-bottom: 1px solid #eaeaea;
  transition: height 0.2s linear;

  .logo {
    width: 40px;
    height: 40px;
  }

  &.fade {
    height: 0;
  }

  &:hover {
    .click {
      opacity: 1;
    }
  }
}

.title_box {
  display: flex;
  align-items: center;

  h2 {
    color: #000000;
    margin-left: 16px;
    font-family: PingFangSC-Bold;
  }
}

.user_info {
  display: flex;
  align-items: center;

  span {
    color: #000;
    font-size: 15px;
    font-weight: 500;
  }
  .alert {
    margin-right: 40px;
    i {
      font-size: 23px;
    }
  }
}

.user {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  margin-right: 8px;
}
.user_role{
  display: flex;
  flex-direction: column;
  .role--span{
    &:nth-child(2){
      font-family: PingFangSC-Bold !important;
      display: inline-block;
      font-size: 13px;
      margin-top: 3px;
      font-weight: 500;
    }
  }
}
</style>
