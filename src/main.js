import { createApp } from 'vue'
import App from './App.vue'

// 导入路由
import router from './router'
// 导入element icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入 ElementPlus
import ElementPlus from 'element-plus'
// 导入 ElementPlus 样式
import 'element-plus/dist/index.css'
// 配置ElementPlus中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入全局css样式
import '@/styles/index.scss'
// 用户管理样式
import '@/styles/common.scss'
// svg图标
import 'virtual:svg-icons-register'
// 导入pinia
import pinia from './store'

const app = createApp(App)
app.use(pinia)
app.use(router)
// app.use(ElementPlus)
app.use(ElementPlus, {
    locale: zhCn,
})


app.mount('#app')
