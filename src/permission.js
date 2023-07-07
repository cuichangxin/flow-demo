import Cookies from 'js-cookie'
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from './utils/auth';
import { useKeepAliver } from './store/keepAlive';
import { useCancelToken } from './store/cancelToken';

NProgress.configure({ showSpinner: false });
const whiteList = ['/login', '/board'];

router.beforeEach((to, from, next) => {
  NProgress.start()
  
  // 清除上个页面的请求
  const { clearCancelToken } = useCancelToken()
  clearCancelToken()

  // 动态添加keepalive缓存
  if (to.meta.keepAlive) {
    const { addKeepAlive } = useKeepAliver()
    addKeepAlive(to.name)
  }
  // 有token
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
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
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})