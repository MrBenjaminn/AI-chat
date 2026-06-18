import { createRouter, createWebHistory } from 'vue-router'
import { RouteNames } from '@/shared/config/routes.ts'

const routes = [
  {
    path: '/home',
    name: RouteNames.homePage,
    component: () => import('@/pages/main/ui/MainAreaPages.vue'),
    alias: '/',
  },
  {
    path: '/chat/:id',
    name: RouteNames.chat,
    component: () => import('@/pages/main/ui/MainAreaPages.vue'),
  },
  {
    path: '/login',
    name: RouteNames.loginPage,
    component: () => import('@/pages/login/ui/LoginPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
