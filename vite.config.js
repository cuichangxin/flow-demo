import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
// import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV, VITE_APP_BASE_URL } = env
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://xxx/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: [
      vue(),
      AutoImport({
        includes: [
          /\.vue$/,
          /\.vue\?vue/,
          /\.md$/,
        ],
        imports: [
          'vue',
          'vue-router',
          'pinia'
        ]
      }),
    ],
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      // https://github.com/vuejs/core/issues/4344
      dedupe: [
        'vue'
      ]
    },
    server: {
      port: 8080,
      host: true,
      // open: true,
      proxy: {
        '/api': {
          target: VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, '')
        }
      }
    },
    build: {
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
          entryFileNames: 'assets/js/[name].[hash].js',
          chunkFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: (file) => {
            const filename = file.name.split('/')[file.name.split('/').length - 1].split('.')[1]
            if (file.name.indexOf('images') !== -1) {
              return `assets/img/[name].${filename}`
            } else if (file.name.indexOf('svg') !== -1) {
              return `assets/svg/[name].${filename}`
            } else if (file.name.indexOf('iconfont') !== -1) {
              return `assets/iconfont/[name].[hash].[ext]`
            } else {
              return 'assets/[ext]/[name].[hash].[ext]'
            }
          }
        }
      },
      assetsInlineLimit: 0 // 禁用图片转bash64
    }
  }
})
