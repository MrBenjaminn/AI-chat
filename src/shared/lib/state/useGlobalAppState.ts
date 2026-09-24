import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'
import { RouteNames } from '@/shared'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/entities/chat/useChatStore'

export const useGlobalAppState = createGlobalState(() => {
  const sideBarState = ref<boolean>(true)
  const isLlmLoading = ref<boolean>(false)
  const router = useRouter()

  function sideBarOut() {
    sideBarState.value = !sideBarState.value
  }

  async function startNewChat() {
    const chatStore = useChatStore()
    chatStore.setActiveChat(null)
    chatStore.files = []
    if (router.currentRoute.value.name !== RouteNames.homePage) {
      await router.push({ name: RouteNames.homePage })
    }
  }

  return { sideBarState, isLlmLoading, sideBarOut, startNewChat }
})
