import { apiInstanceAuth } from '@/shared/api/base.ts'
import { PKCE_KEY } from "@/pages/login/model/storage-key.ts";

export async function responseApiKey(code: string) {

  const data = sessionStorage.getItem(PKCE_KEY)
  if (!data) return
  const obj = JSON.parse(data)

  const response = await apiInstanceAuth.post('/auth/keys', {
    code: code,
    code_verifier: obj.codeVerifier,
    code_challenge_method: 'S256',
  })

  return response.data
}
