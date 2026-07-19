export enum messageStatus {
  sent = 'sent',
  pending = 'pending',
  error = 'error',
}

export enum RoleSender {
  user = 'user',
  assistant = 'assistant',
}

export interface CreateMessageParams {
  files?: Attachments[]
  sender: RoleSender
  contentText: string
  status: messageStatus
  chatId: string
}

export interface Chat {
  id: string
  title: string
  createAt: number
  updateAt: number
}

export interface MessagesMap {
  [chatId: string]: MessageType[]
}

export enum TypeFiles {
  audio = 'audio',
  video = 'video',
  file = 'file',
  image = 'image',
}

export type ListTypeFiles = 'audio' | 'video' | 'file'

export enum TypeFormatFiles {
  dataUrl = 'dataUrl',
  base = 'base64',
  url = 'url',
}

export interface Attachments {
  id: string
  kind: TypeFiles
  mimeType: string
  fileName: string
  size: number
  source?: {
    type: TypeFormatFiles
    value: string
  }
  meta?: {
    durations?: number
    format?: string
  }
  previewUrl?: string
}

export interface MessageType {
  attachments?: Attachments[]
  id: string
  chatId: string
  role: RoleSender
  content: string
  createdAt: number
  status?: messageStatus
  time: string
}

export interface ContextMessages {
  role: RoleSender
  content: string
}
