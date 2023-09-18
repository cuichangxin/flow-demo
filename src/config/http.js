import Axios from "axios";
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getToken } from "@/utils/auth";
import errorCode from "@/utils/errCode";
import router from '../router/index'
import cache from './cache'
import { useCancelToken } from "../store/cancelToken";


// 请求记录栈
// const requestStack = []
// let cid = 0
// function showLoading() {
//   document.getElementById('el-loading-spin').style.display = 'block'
// }
// function hideLoading() {
//   document.getElementById('el-loading-spin').style.display = 'none'
// }

/**
 * 请求记录入栈
*/
// function pushTarget() {
//   if (!requestStack.length) {
//     showLoading()
//   }
//   requestStack.push(cid++)
// }
/**
 * 请求记录出栈
*/
// function popTarget() {
//   if (requestStack.length) {
//     requestStack.pop()
//   }
//   // 所有请求处理完毕清空
//   if (!requestStack.length) {
//     hideLoading()
//   }
// }

// 超时时间
Axios.defaults.timeout = 100000

Axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 默认URL
// Axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API
Axios.defaults.baseURL = 'http://39.105.98.46:16380'
// 通用请求拦截器
Axios.interceptors.request.use(
  config => {
    // pushTarget()
    // 是否需要设置token
    // const isToken = (config.headers || {}).isToken === false

    // config.cancelToken = new Axios.CancelToken((cancel) => {
    //   // 正在进行的请求记录
    //   const { addCancelToken } = useCancelToken()
    //   addCancelToken(cancel)
    // })
    if (getToken()) {
      config.headers['Authorization'] = getToken()
    }
    if (config.method === 'post' || config.method === 'put') {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      }
      const sessionObj = cache.session.getJSON('sessionObj')
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj)
      } else {
        const s_url = sessionObj.url;                // 请求地址
        const s_data = sessionObj.data;              // 请求数据
        const s_time = sessionObj.time;              // 请求时间
        const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject(new Error(message))
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// 通用响应拦截器
Axios.interceptors.response.use(
  response => {
    // popTarget()
    // 未设置状态码则默认成功状态
    const code = response.data.code || 200
    // 获取错误信息
    const msg = errorCode[code] || response.data.msg || errorCode['default']
    if (code === 401) {
      ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
        router.replace({ path: '/login' })
      }).catch(() => { })
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      ElMessage({ message: msg, type: 'warning' })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      ElNotification.error({ title: msg })
      return Promise.reject('error')
    } else {
      return Promise.resolve(response.data)
    }
  },
  error => {
    // popTarget()
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

function api(url, method = 'post') {
  return function (params) {
    try {
      switch (method) {
        case 'post':
          return Axios.post(url, params)
        case 'get':
          return Axios.get(url, { params })
        default:
          throw new Error('请选择post或者get请求方法')
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default api
