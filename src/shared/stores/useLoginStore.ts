import { defineStore } from 'pinia'
import { responseApiKey } from '@/pages/login/api/api'
import { ref } from 'vue'
import {
  createSHA256CodeChallenge,
  generateCodeVerifier,
} from '@/pages/login/model/generationService'
import { PKCE_KEY } from '@/pages/login/model/storage-key'
import { authService } from '../lib/auth/tokenService'
import { RouterPaths } from '../config/routes'
import type { authState } from '@/pages/login/model/types'
import avatarUser from '../assets/images/AvatarUser.png'
import avatarAssistant from '../assets/images/AvatarAssistant.png'

export const useLoginStore = defineStore('loginStore', () => {
  const errorMessage = ref('')
  const baseAppUrl = import.meta.env.VITE_OPENROUTER_APP_URL
  const baseUrlAuth = import.meta.env.VITE_OPENROUTER_BASE_URL_AUTH
  const objDataAuth = ref<Partial<authState>>({})
  const isAuthenticated = ref<boolean>(!!objDataAuth.value.userKey)

  function syncAuthData() {
    objDataAuth.value = authService.getAuthData()
  }

  async function startAuth() {
    const codeVerifier = generateCodeVerifier()
    const generatedCodeChallenge = await createSHA256CodeChallenge(codeVerifier)

    const dataTemp = JSON.stringify({ codeVerifier, generatedCodeChallenge })

    sessionStorage.setItem(PKCE_KEY, dataTemp)

    const myUrl = new URL(baseUrlAuth)

    myUrl.searchParams.set('callback_url', `${baseAppUrl}${RouterPaths.login}`)
    myUrl.searchParams.set('code_challenge', generatedCodeChallenge)
    myUrl.searchParams.set('code_challenge_method', 'S256')

    location.href = myUrl.toString()
  }

  async function callBackCode() {
    errorMessage.value = ''
    const urlParams = new URLSearchParams(window.location.search)
    const codeParam = urlParams.get('code')

    if (!codeParam) return

    try {
      const response = await responseApiKey(codeParam)

      isAuthenticated.value = true

      const date = Date.now()

      const authData: authState = {
        isAuthenticated: isAuthenticated.value,
        userKey: response.key,
        createdAt: String(date),
        updatedAt: String(date),
      }

      authService.setAuthData(authData)

      sessionStorage.removeItem(PKCE_KEY)

      window.history.replaceState(null, '', baseAppUrl)

      syncAuthData()

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

  return {
    startAuth,
    callBackCode,
    errorMessage,
    currentUser,
    assistant,
    objDataAuth,
    syncAuthData,
  }
})
