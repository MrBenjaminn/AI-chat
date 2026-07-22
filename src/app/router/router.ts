import { createRouter, createWebHistory } from 'vue-router'
import { RouteNames, RouterPaths } from '@/shared/config/routes'
import type { RouteRecordRaw } from 'vue-router'
import { useLoginStore } from '@/shared/stores/useLoginStore'
import { useChatStore } from '@/entities/chat/useChatStore.ts'

const routes: RouteRecordRaw[] = [
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

router.beforeEach((to, _from) => {
  const auth = to.matched.some((record) => record.meta.requiresAuth)
  const loginStore = useLoginStore()
  loginStore.syncAuthData()

  if (auth && !loginStore.objDataAuth.userKey) {
    return RouterPaths.login
  }

  if (to.name === RouteNames.loginPage && loginStore.objDataAuth.userKey) {
    return '/'
  }

  if (to.name === RouteNames.chat) {
    const chatStore = useChatStore()
    const rawId = to.params.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId

    const chat = chatStore.chatsList.find((c) => c.id === id)

    if (!chat) {
      return { name: RouteNames.homePage }
    }

    chatStore.setActiveChat(id)
  }
})
export default router
