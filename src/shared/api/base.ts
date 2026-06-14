import axios from 'axios'
const baseUrl = import.meta.env.VITE_OPENROUTER_BASE_URL
const api = import.meta.env.VITE_OPENROUTER_API_KEY
const openRouterTitle = import.meta.env.VITE_OPENROUTER_APP_TITLE
const referer = import.meta.env.VITE_OPENROUTER_APP_URL

export const apiInstance = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    Authorization: `Bearer ${api}`,
    'HTTP-Referer': `${referer}`,
    'X-OpenRouter-Title': `${openRouterTitle}`,
    'Content-Type': 'application/json',
  },
})
