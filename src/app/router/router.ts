import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    name: 'home-page',
    component: () => import('@/features/newChat/EmptyChat.vue'),
    alias: '/',
  },
  { path: '/chat/:id', name: 'chat', component: () => import('@/widgets/ChatPages.vue') },
  { path: '/login', name: 'login-page', component: () => import('@/pages/LoginPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
