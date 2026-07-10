import { convertToBase64Url } from '@/shared/lib/file/converToBase64'

export async function createSHA256CodeChallenge(input: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const array = new Uint8Array(hash)
  return convertToBase64Url(array)
}

export function generateCodeVerifier() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return convertToBase64Url(array)
}
