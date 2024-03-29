import { createApp,h } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/styles/elementui-theme.scss'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/styles/index.scss'
import { createPinia } from 'pinia'
import mitt from 'mitt'
import vueTyped from 'vue3typed'
import axios from './api/api'
import './permission'
import { getElementLabelLine } from 'element-tree-line'
import modal from './utils/modal'
import VueGridLayout from 'vue-grid-layout'
import directive from './directive'

const ElementLabelLine = getElementLabelLine(h)
const app = createApp(App)
const pinia = createPinia()

// console.log(import.meta.env)
app.use(ElementPlus,{
  locale:zhCn
})
app.use(router)
app.use(pinia)
app.use(vueTyped)
app.use(VueGridLayout)
app.config.globalProperties.$bus = mitt()
app.config.globalProperties.$axios = axios
app.config.globalProperties.$modal = modal
app.component(ElementLabelLine.name,ElementLabelLine)

directive(app)
app.mount('#app')
