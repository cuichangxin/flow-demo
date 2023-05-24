import Axios from "axios";
// import qs from 'qs'

// let baseURL
// const env = VITE_APP_ENV
// if (env == 'development') {
//   // baseURL = ''
// } else {
//   // baseURL = ''
// }

Axios.defaults.timeout = 100000

// 通用请求拦截器
Axios.interceptors.request.use(
  config => {
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// 通用响应拦截器
Axios.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      return Promise.reject(response.data)
    }
    return response.data
  },
  err => {
    return Promise.reject(err)
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
