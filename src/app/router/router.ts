import { createRouter, createWebHistory } from 'vue-router'
import { EmptyChat } from '@/features'
import { ChatPages } from '@/widgets'

const routes = [
  { path: '/home', component: EmptyChat, alias: '/' },
  { path: '/chat/:id?', component: ChatPages },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
