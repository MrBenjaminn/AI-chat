import axios from 'axios'
import { authService } from '@/shared/lib/auth/token-service'

const baseUrl = import.meta.env.VITE_OPENROUTER_BASE_URL
const openRouterTitle = import.meta.env.VITE_OPENROUTER_APP_TITLE
const referer = import.meta.env.VITE_OPENROUTER_APP_URL

export const apiInstanceChat = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    'HTTP-Referer': `${referer}`,
    'X-OpenRouter-Title': `${openRouterTitle}`,
    'Content-Type': 'application/json',
  },
})

apiInstanceChat.interceptors.request.use(
  (config) => {
    const userKey = authService.getAuthData()?.userKey

    if (userKey) {
      config.headers.Authorization = `Bearer ${userKey}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const apiInstanceAuth = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})
