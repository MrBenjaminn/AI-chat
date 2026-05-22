import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import avatarUser from '@/shared/assets/images/AvatarUser.png'
import avatarAssistant from '@/shared/assets/images/AvatarAssistant.png'

export const storeData = defineStore('storeData', () => {
  const router = useRouter()

  const sideBarState = ref<boolean>(true)
  function sideBarOut() {
    sideBarState.value = !sideBarState.value
  }

  function startNewChat() {
    router.push('/home')
  }

  const currentUser = ref({
    name: 'Mauro Sicard',
    avatar: avatarUser,
  })

  const assistant = ref({
    name: 'LanguageGUI',
    avatar: avatarAssistant,
  })

  return {
    startNewChat,
    currentUser,
    assistant,
    sideBarState,
    sideBarOut,
  }
})
