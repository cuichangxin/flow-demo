<template>
  <el-header class="header" :class="{ 'fade': isOut }">
    <div v-if="!isOut" class="title_box">
      <img class="logo" src="../../assets/image/logo.png" />
      <h2>航天软件智能生产线</h2>
    </div>
    <p v-if="!isOut" class="user_info">
      <span>欢迎您！</span>
      <el-dropdown trigger="click" @command="handleDrop">
        <span class="user">
          <img class="user_img" src="../../assets/image/renyuan.png" />
          {{ userInfo.userName }}
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
    <mark-poiner :isOut="isOut" :direction="'bottom'" @hideMenu="hideMenu"></mark-poiner>
  </el-header>
</template>
<script setup>
import markPoiner from '../common/mark/markPoiner.vue'
import Cookies from 'js-cookie'

const instance = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const userInfo = ref({
  userName: Cookies.get('userName')
})

watch(() => route.path, (n) => {
  if (n == '/broad') {
    isOut.value = true
  } else {
    isOut.value = false
  }
})

const hideMenu = (val) => {
  isOut.value = val
  instance.proxy.$bus.emit('resize', isOut.value)
}
const isOut = ref(false)

const handleDrop = (command) => {
  if (command === '1') {
    Cookies.remove('userId')
    Cookies.remove('password')
    Cookies.remove('userName')
    Cookies.remove('roleId')
    router.push({
      path:'/login'
    })
  }
  if (command === '2') {
    console.log('set');
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #545c64;
  position: relative;
  z-index: 11;
  transition: height .2s linear;

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
    color: #fff;
    font-family: SourceHanSansSC-regular;
    margin-left: 8px;
  }
}

.user_info {
  display: flex;

  span {
    color: #fff;
    font-size: 15px;
    font-weight: 500;
  }
}

.user {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user_img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
</style>
