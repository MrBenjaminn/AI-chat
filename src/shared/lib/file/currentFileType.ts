import { type Attachments, TypeFiles } from '@/entities/chat/types'
import AudioIcon from '@shared/assets/icons/Audio-icon.svg?component'
import VideoIcon from '@shared/assets/icons/Video-icon.svg?component'
import PdfIcon from '@shared/assets/icons/Pdf-icon.svg?component'

export function currentTypeFile(file: File) {
  if (file.type.includes('pdf')) return TypeFiles.file
  if (file.type.startsWith(`${TypeFiles.audio}/`)) return TypeFiles.audio
  if (file.type.startsWith(`${TypeFiles.video}/`)) return TypeFiles.video
  if (file.type.startsWith(`${TypeFiles.image}/`)) return TypeFiles.image
  return null
}

export function checkType(file: Attachments) {
  switch (file.kind) {
    case TypeFiles.audio:
      return AudioIcon
    case TypeFiles.video:
      return VideoIcon
    case TypeFiles.file:
      return PdfIcon
    default:
      return null
  }
}
