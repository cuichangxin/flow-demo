import Cookies from 'js-cookie'
import router from './router'

const whiteList = ['/login','/broad'];

router.beforeEach((to, from, next) => {
  if (Cookies.get('userId')) {
    // 有token
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
})