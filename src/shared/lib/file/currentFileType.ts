import { type Attachments, type ListTypeFiles, TypeFiles } from '../../type/chats'
import AudioIcon from '../../assets/icons/Audio-icon.svg?component'
import VideoIcon from '../../assets/icons/Video-icon.svg?component'
import PdfIcon from '../../assets/icons/Pdf-icon.svg?component'
import { type Component } from 'vue'

export function currentTypeFile(file: File) {
  if (file.type.includes('pdf')) return TypeFiles.file
  if (file.type.startsWith(`${TypeFiles.audio}/`)) return TypeFiles.audio
  if (file.type.startsWith(`${TypeFiles.video}/`)) return TypeFiles.video
  if (file.type.startsWith(`${TypeFiles.image}/`)) return TypeFiles.image
  return null
}

const fileStrategy: Record<ListTypeFiles, Component> = {
  [TypeFiles.audio]: AudioIcon,
  [TypeFiles.video]: VideoIcon,
  [TypeFiles.file]: PdfIcon,
}

export function checkType(file: Attachments): Component | null {
  if (file.kind === TypeFiles.image) return null
  const resultTypeFiles: ListTypeFiles = file.kind
  return fileStrategy[resultTypeFiles]
}
