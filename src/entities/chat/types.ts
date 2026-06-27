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
  files?: Attachments[];
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

export interface Attachments {
  id: string;
  kind: 'audio' | 'video' | 'file' | 'image'
  mimeType: string;
  fileName: string;
  size: number;
  source: {
    type: 'dataUrl' | 'base64' | 'url';
    value: string;
  };
  meta?: {
    durations?: number;
    format?: string;
  }
  previewUrl?: string;
}

export interface MessageType {
  attachments?: Attachments[]
  id: string
  chatId: string
  role: roleSender
  content: string
  createdAt: number
  status?: messageStatus
  time: string
}