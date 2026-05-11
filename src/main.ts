import { createApp } from 'vue'
import './style.css'
import './normalize.css'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app
  .use(pinia)
  .mount('#app')
