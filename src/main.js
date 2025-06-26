import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VTreeview } from 'vuetify/labs/VTreeview'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router/index.js'

const vuetify = createVuetify({
  components: {
    ...components,
    VTreeview
  },
  directives,
  icons: {
    defaultSet: 'mdi'
  },
  theme: {
    defaultTheme: 'dark',
  },
})

const pinia = createPinia()
export { pinia }

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
