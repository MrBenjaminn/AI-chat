import { createApp } from 'vue'
import App from './app/App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app
  .use(pinia)
  .mount('#app')
