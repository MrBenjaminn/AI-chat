import { defineStore } from 'pinia'

export const useLoginStore = defineStore('loginStore', () => {
  async function createSHA256CodeChallenge(input: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const array = new Uint8Array(hash)
    return convertToBase64Url(array)
  }

  function convertToBase64Url(bites: Uint8Array): string {
    const binaryString = String.fromCharCode(...bites)
    const base = btoa(binaryString)

    return base.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  const array = new Uint8Array(32)
  crypto.getRandomValues(array)

  async function startAuth() {
    const url = import.meta.env.VITE_OPENROUTER_APP_URL
    const codeVerifer = convertToBase64Url(array)

    const generatedCodeChallenge = await createSHA256CodeChallenge(codeVerifer)

    const dataTemp = JSON.stringify({ codeVerifer, generatedCodeChallenge })

    sessionStorage.setItem('pkce_data', dataTemp)

    location.href = `https://openrouter.ai/auth?callback_url=${url}&code_challenge=${generatedCodeChallenge}&code_challenge_method=S256`
  }

  return { startAuth }
})
