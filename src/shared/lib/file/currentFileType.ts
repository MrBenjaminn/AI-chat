import { type Attachments, type ListTypeFiles, TypeFiles } from '../../type/chats'
import AudioIcon from '../../assets/icons/Audio-icon.svg?component'
import VideoIcon from '../../assets/icons/Video-icon.svg?component'
import PdfIcon from '../../assets/icons/Pdf-icon.svg?component'

export function currentTypeFile(file: File) {
  if (file.type.includes('pdf')) return TypeFiles.file
  if (file.type.startsWith(`${TypeFiles.audio}/`)) return TypeFiles.audio
  if (file.type.startsWith(`${TypeFiles.video}/`)) return TypeFiles.video
  if (file.type.startsWith(`${TypeFiles.image}/`)) return TypeFiles.image
  return null
}

export function checkType(file: Attachments) {
  if (file.kind === TypeFiles.image) return
  const resultTypeFiles: ListTypeFiles = file.kind

  switch (resultTypeFiles) {
    case TypeFiles.audio:
      return AudioIcon
    case TypeFiles.video:
      return VideoIcon
    case TypeFiles.file:
      return PdfIcon
    default:
      const exhaustiveCheck: never = resultTypeFiles
      return exhaustiveCheck
  }
}
