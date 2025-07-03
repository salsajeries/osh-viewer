import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import { simpleWorkerPlugin, workersFromDir } from 'simple-worker-vite/plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'osh-js': fileURLToPath(new URL('./lib/osh-js', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      external: ['fsevents', 'node:path'],
    }
  },
  ssr: {
    noExternal: ['osh-js', 'cesium', 'leaflet']
  },
  optimizeDeps: {
    include: [ 'cesium', 'leaflet', 'osh-js'],
    exclude: []
  },
  worker: {
    format: 'es',
    rollupOptions: {

    }
  }
})
