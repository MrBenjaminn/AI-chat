export function finalBase64Url(result: string) {
  return result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function convertToBase64Url(bites: Uint8Array): string {
  const binaryString = String.fromCharCode(...bites)
  const base = btoa(binaryString)

  return finalBase64Url(base)
}
