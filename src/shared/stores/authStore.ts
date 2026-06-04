import { defineStore } from 'pinia'
import { ref } from 'vue'
import avatarUser from '@/shared/assets/images/AvatarUser.png'
import avatarAssistant from '@/shared/assets/images/AvatarAssistant.png'

export const useAuth = defineStore('auth', () => {
  const currentUser = ref({
    name: 'Mauro Sicard',
    avatar: avatarUser,
  })

  const assistant = ref({
    name: 'LanguageGUI',
    avatar: avatarAssistant,
  })

  return { currentUser, assistant }
})
