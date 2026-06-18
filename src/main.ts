import { createApp } from 'vue'
import App from './app/App.vue'
import { createPinia } from 'pinia'
import router from './app/router/router.ts'

const app = createApp(App)
const pinia = createPinia()

app.use(router).use(pinia).mount('#app')
