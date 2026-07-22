import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'
import { RouteNames } from '@/shared'
import { useRouter } from 'vue-router'

export const useGlobalAppState = createGlobalState(() => {
  const sideBarState = ref<boolean>(true)
  const isLlmLoading = ref<boolean>(false)
  const router = useRouter()

  function sideBarOut() {
    sideBarState.value = !sideBarState.value
  }

  async function startNewChat() {
    await router.push({ name: RouteNames.homePage })
  }

  return { sideBarState, isLlmLoading, sideBarOut, startNewChat }
})
