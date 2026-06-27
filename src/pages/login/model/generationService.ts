
  export function finalBase64Url(result: string)  {
    return result
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  export function convertToBase64Url(bites: Uint8Array): string {
    const binaryString = String.fromCharCode(...bites)
    const base = btoa(binaryString)

    return finalBase64Url(base)
  }

  export async function createSHA256CodeChallenge(input: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const array = new Uint8Array(hash)
    return convertToBase64Url(array)
  }

  export function generateCodeVerifier(){
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return convertToBase64Url(array)
  }
