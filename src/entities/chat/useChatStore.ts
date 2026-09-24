import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { format } from 'date-fns'
import type {
  Attachments,
  Chat,
  CreateMessageParams,
  MessagesMap,
  MessageType,
  FileRaw,
} from '@/shared'
import { messageStatus, RoleSender } from '@/shared/type/chats'

export const useChatStore = defineStore('chatStore', () => {
  const chatsList = ref<Chat[]>([])
  const messagesMap = ref<MessagesMap>({})
  const files = ref<Attachments[]>([])
  const filesSource = ref<FileRaw[]>([])
  const chatActiveId = ref<string | null>(null)

  const STORAGE_KEY = 'llm_chat_app:v1'

  function setActiveChat(id: string | null) {
    chatActiveId.value = id
  }

  function saveToStorage() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          chats: chatsList.value,
          messagesByChatId: messagesMap.value,
        }),
      )
    } catch (e) {
      console.error('Ошибка сохранения в localStorage:', e)
    }
  }

  // Загрузка и надежная валидация данных из localStorage
  const rawData = localStorage.getItem(STORAGE_KEY)
  if (rawData) {
    try {
      const parsedData = JSON.parse(rawData)

      // Поддержка различных форматов хранения (массив, объект с версией и без)
      const rawChats = Array.isArray(parsedData)
        ? parsedData
        : Array.isArray(parsedData?.chats)
          ? parsedData.chats
          : []

      const rawMessages = parsedData?.messagesByChatId || parsedData?.messages || {}

      chatsList.value = rawChats
        .filter((c: any) => c && c.id)
        .map((c: any) => ({
          id: String(c.id),
          title: c.title || 'Новый чат',
          createAt: Number(c.createAt || c.createdAt) || Date.now(),
          updateAt: Number(c.updateAt || c.updatedAt) || Date.now(),
        }))

      const cleanedMessagesMap: MessagesMap = {}
      for (const [key, msgs] of Object.entries(rawMessages)) {
        if (Array.isArray(msgs)) {
          cleanedMessagesMap[key] = msgs
            .filter((m: any) => m && typeof m === 'object')
            .map((m: any) => ({
              id: m.id || crypto.randomUUID(),
              chatId: m.chatId || key,
              role: m.role === 'user' ? RoleSender.user : RoleSender.assistant,
              content: typeof m.content === 'string' ? m.content : String(m.content || ''),
              createdAt: Number(m.createdAt || m.createAt) || Date.now(),
              status: m.status || messageStatus.sent,
              time: m.time || '',
              attachments: Array.isArray(m.attachments) ? m.attachments : undefined,
            }))
        }
      }
      messagesMap.value = cleanedMessagesMap
    } catch (e) {
      console.error('Ошибка импорта из localStorage:', e)
    }
  }

  // Синхронизация с localStorage при реактивных изменениях
  watch(
    [chatsList, messagesMap],
    () => {
      saveToStorage()
    },
    { deep: true },
  )

  const activeChat = computed(() => {
    return chatsList.value.find((chat) => chat.id === chatActiveId.value)
  })

  function createNewChat(chatId: string, firstMessageText: string) {
    const trimmed = firstMessageText.trim()
    const shortTitle = trimmed.length > 27 ? trimmed.slice(0, 27) + '...' : trimmed || 'Новый чат'

    messagesMap.value = {
      ...messagesMap.value,
      [chatId]: [],
    }

    chatsList.value.unshift({
      id: chatId,
      title: shortTitle,
      createAt: Date.now(),
      updateAt: Date.now(),
    })

    chatActiveId.value = chatId
    saveToStorage()
  }

  function entryChat(chatId?: string) {
    const targetChat = chatId ? chatsList.value.find((c) => c.id === chatId) : activeChat.value

    if (targetChat) {
      targetChat.updateAt = Date.now()
    }

    if (chatId && messagesMap.value[chatId]) {
      messagesMap.value[chatId] = [...messagesMap.value[chatId]]
    }
    saveToStorage()
  }

  const currentMessages = computed(() => {
    if (!chatActiveId.value) return []
    return messagesMap.value[chatActiveId.value] || []
  })

  const lastUserMessage = computed(() => {
    const messages = currentMessages.value
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === RoleSender.user) {
        return messages[i]
      }
    }
    return undefined
  })

  const contextMessages = computed(() => {
    if (!chatActiveId.value) return []
    const currentChatHistory = messagesMap.value[chatActiveId.value] || []
    const messagesForSend = currentChatHistory.map((el) => ({
      role: el.role,
      content: el.content,
    }))
    return messagesForSend.slice(-9)
  })

  function getTime() {
    const date = new Date()
    return String(format(date, 'HH:mm'))
  }

  function createNewMessage(params: CreateMessageParams) {
    const linkMessage: MessageType = {
      attachments: params.files,
      id: crypto.randomUUID(),
      chatId: params.chatId,
      role: params.sender,
      content:
        typeof params.contentText === 'string'
          ? params.contentText
          : String(params.contentText || ''),
      createdAt: Date.now(),
      status: params.status,
      time: getTime(),
    }

    if (!messagesMap.value[params.chatId]) {
      messagesMap.value = {
        ...messagesMap.value,
        [params.chatId]: [],
      }
    }

    messagesMap.value[params.chatId].push(linkMessage)
    saveToStorage()

    return linkMessage
  }

  return {
    messagesMap,
    currentMessages,
    createNewMessage,
    chatsList,
    activeChat,
    createNewChat,
    entryChat,
    files,
    setActiveChat,
    chatActiveId,
    lastUserMessage,
    contextMessages,
    filesSource,
    saveToStorage,
  }
})
