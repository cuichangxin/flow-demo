import { createApp,h } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/index.scss'
import { createPinia } from 'pinia'
import mitt from 'mitt'
import vueTyped from 'vue3typed'
import axios from './api/api'
import './permission'
import { getElementLabelLine } from 'element-tree-line'
import modal from './utils/modal'

const ElementLabelLine = getElementLabelLine(h)
const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.use(vueTyped)
app.config.globalProperties.$bus = mitt()
app.config.globalProperties.$axios = axios
app.config.globalProperties.$modal = modal
app.component(ElementLabelLine.name,ElementLabelLine)
app.mount('#app')
