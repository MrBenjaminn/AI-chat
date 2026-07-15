import type { authState } from '@/pages/login/model/types.ts'

export const authService = {
  getAuthData(): authState {
    const dataAuth = localStorage.getItem('authState') || '{}'
    return JSON.parse(dataAuth)
  },
  setAuthData(data: authState): void {
    localStorage.setItem('authState', JSON.stringify(data))
  },
}
