import type { authState } from '@/pages/login/model/types.ts'
const key = 'authState'
export const authService = {
  getAuthData(): authState {
    const dataAuth = localStorage.getItem(key) || '{}'
    try {
      return JSON.parse(dataAuth)
    } catch (error) {
      console.error('Не удалось прочитать данные:', error)
      return {
        isAuthenticated: false,
        userKey: null,
        createdAt: null,
        updatedAt: null,
      }
    }
  },
  setAuthData(data: authState): void {
    localStorage.setItem(key, JSON.stringify(data))
  },
}
