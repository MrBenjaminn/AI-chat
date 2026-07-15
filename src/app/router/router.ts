import { createRouter, createWebHistory } from 'vue-router'
import { RouteNames, RouterPaths } from '@/shared/config/routes.ts'
import { useLoginStore } from '@/shared/stores/useLoginStore'

const routes = [
  {
    path: RouterPaths.home,
    name: RouteNames.homePage,
    component: () => import('@/pages/main/ui/MainAreaPages.vue'),
    meta: { requiresAuth: true },
    alias: '/',
  },
  {
    path: `${RouterPaths.chat}/:id`,
    name: RouteNames.chat,
    component: () => import('@/pages/main/ui/MainAreaPages.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RouterPaths.login,
    name: RouteNames.loginPage,
    component: () => import('@/pages/login/ui/LoginPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const auth = to.matched.some((record) => record.meta.requiresAuth)
  const loginStore = useLoginStore()
  loginStore.syncAuthData()

  if (auth && !loginStore.objDataAuth.userKey) {
    next(RouterPaths.login)
  } else if (to.name === RouteNames.loginPage && loginStore.objDataAuth.userKey) {
    next('/')
  } else {
    next()
  }
})
export default router
