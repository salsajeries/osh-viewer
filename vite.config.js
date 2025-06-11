import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'osh-js': '/node_modules/osh-js'
    }
  },
  build: {
    rollupOptions: {
      external: ['fsevents', 'node:path'],
      plugins: [
        {
          name: 'treat-node-modules-workers',
          resolveId(source) {
            if (source.endsWith('.worker.js')) {
              return { id: source, external: false };
            }
            return null;
          }
        }
      ]
    }
  },
  ssr: {
    noExternal: ['osh-js', 'cesium', 'leaflet']
  },
  optimizeDeps: {
    include: [ 'cesium', 'leaflet'],
    exclude: ['Widgets/InfoBox/InfoBoxDescription.css', 'osh-js']
  },
  worker : {
    format:  'es',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
