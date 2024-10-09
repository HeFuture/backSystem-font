import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
    // 指定symbolId格式
    symbolId: "icon-[dir]-[name]",
  })
  ],
  server: {
    port: 8080, // 默认启动的端口号
    // open: true, // 自动打开默认浏览器
    cors: true, // cors依赖，设置允许跨域
  },
  // resolve: {
  //   alias: {
  //     // "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
  //     '@': path.resolve(__dirname, './src')
  //   }
  // },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      assets: '@/assets',
      utils: '@/utils',
      api: '@/api'
    },
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
  },
  // scss全局变量的配置
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: '@import "./src/styles/variable.scss";',
      },
    },
  },
})
