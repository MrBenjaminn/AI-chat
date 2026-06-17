import { defineStore } from 'pinia'
import { responseApiKey } from "@/pages/login/api/api";
import { ref } from 'vue'
import { createSHA256CodeChallenge, generateCodeVerifier } from '@/pages/login/model/generationService'
import { PKCE_KEY } from "@/pages/login/model/storage-key";
import avatarUser from "@/shared/assets/images/AvatarUser.png";
import avatarAssistant from "@/shared/assets/images/AvatarAssistant.png";

export const useLoginStore = defineStore('loginStore', () => {
  const errorMessage = ref('')
  const url = import.meta.env.VITE_OPENROUTER_APP_URL
  const isAuthenticated = ref(false)

  async function startAuth() {
    const codeVerifier = generateCodeVerifier()
    const generatedCodeChallenge = await createSHA256CodeChallenge(codeVerifier)

    const dataTemp = JSON.stringify({ codeVerifier, generatedCodeChallenge })

    sessionStorage.setItem(PKCE_KEY, dataTemp)

    location.href = `https://openrouter.ai/auth?callback_url=http://localhost:5173/login&code_challenge=${generatedCodeChallenge}&code_challenge_method=S256`
  }

  async function callBackCode() {
    errorMessage.value = ''
    const urlParams = new URLSearchParams(window.location.search)
    const codeParam = urlParams.get('code')
    if(!codeParam) return

    try {
      const response = await responseApiKey(codeParam)

      const key = response.key

      isAuthenticated.value = true

      localStorage.setItem('userKey', key)

      sessionStorage.removeItem(PKCE_KEY)

      window.history.replaceState(null, '', url)

      return response
    } catch (error: any) {
      if (!error) return console.log(error.message)
      errorMessage.value = error.message || 'Что то пошло не так.'
      console.error('Ошибка', error)
    }
  }

  const currentUser = ref({
    name: 'Mauro Sicard',
    avatar: avatarUser,
  })

  const assistant = ref({
    name: 'LanguageGUI',
    avatar: avatarAssistant,
  })

  return { startAuth, callBackCode, errorMessage, currentUser, assistant }
})
