export interface message {
  id: string
  chatId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  status?: 'sent' | 'pending' | 'error'
  time: string
}

export interface messagesMap {
  [chatId: string]: message[]
}