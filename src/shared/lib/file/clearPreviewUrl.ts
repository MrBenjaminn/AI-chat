import type { Attachments } from '../../type/chats'

export function clearPreviewUrl(file: Attachments[], index?: number) {
  const revoke = (item: Attachments) => {
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl)
    }
  }

  if (typeof index === 'number' && index >= 0) {
    revoke(file[index])
  } else {
    file.forEach((file: Attachments) => {
      revoke(file)
    })
  }
}
