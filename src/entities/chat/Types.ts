export interface message {
  id: string
  chatId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  status?: 'sent' | 'pending' | 'error'
  time: string
}

export interface chat {
  id: string
  title: string
  createAt: number
  updateAt: number
}

export interface messagesMap {
  [chatId: string]: message[]
}
