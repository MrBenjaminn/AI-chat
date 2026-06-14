export interface MessageType {
  id: string
  chatId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  status?: 'sent' | 'pending' | 'error'
  time: string
}

export enum messageStatus {
  sent = 'sent',
  pending = 'pending',
  error = 'error',
}

export enum roleSender {
  user = 'user',
  assistant = 'assistant',
}

export interface createMessageParams {
  sender: roleSender
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
