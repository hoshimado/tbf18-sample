import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: "./", // Production Buildを「相対パスで動作するオプション」で実施する
  build: {
    outDir: "../backend/src/public", // Production buildの出力先を変更
    emptyOutDir: true, // 出力先のディレクトリを空にする
  },
})
