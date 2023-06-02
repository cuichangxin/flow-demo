import Axios from "axios";
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getToken } from "@/utils/auth";
import errorCode from "@/utils/errCode";

// 请求记录栈
const requestStack = []
let cid = 0
function showLoading() {
  document.getElementById('el-loading-spin').style.display = 'block'
}
function hideLoading() {
  document.getElementById('el-loading-spin').style.display = 'none'
}

/**
 * 请求记录入栈
*/
function pushTarget() {
  if (!requestStack.length) {
    showLoading()
  }
  requestStack.push(cid++)
}
/**
 * 请求记录出栈
*/
function popTarget() {
  if (requestStack.length) {
    requestStack.pop()
  }
  // 所有请求处理完毕清空
  if (!requestStack.length) {
    hideLoading()
  }
}

// 超时时间
Axios.defaults.timeout = 100000

Axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 默认URL
Axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API
// 通用请求拦截器
Axios.interceptors.request.use(
  config => {
    // pushTarget()
    // 是否需要设置token
    const isToken = (config.headers || {}).isToken === false

    if (getToken() && !isToken) {
      config.headers['Authorization'] = getToken()
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
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
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
  err => {
    // popTarget()
    return Promise.reject(err)
  }
)

function api(url, method = 'post', isToken) {
  Axios.defaults.headers.isToken = isToken
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
