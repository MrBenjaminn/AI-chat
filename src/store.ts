import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { routeNames } from '@/shared/config/routes.ts'

export const storeData = defineStore('storeData', () => {
  const router = useRouter()

  const sideBarState = ref<boolean>(true)
  function sideBarOut() {
    sideBarState.value = !sideBarState.value
  }

  function startNewChat() {
    router.push({ name: routeNames.homePage })
  }

  return {
    startNewChat,
    sideBarState,
    sideBarOut,
  }
})
