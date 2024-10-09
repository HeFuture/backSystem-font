

// import { createPinia } from "pinia";
// // 持久化Pinia状态
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// let pinia = createPinia()
// // 注册持久化
// pinia.use(piniaPluginPersistedstate)


import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia