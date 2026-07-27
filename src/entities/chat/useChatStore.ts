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

export const useChatStore = defineStore('chatStore', () => {
  const chatsList = ref<Chat[]>([])
  const messagesMap = ref<MessagesMap>({})
  const files = ref<Attachments[]>([])
  const filesSource = ref<FileRaw[]>([])
  const chatActiveId = ref<string | null>(null)

  const STORAGE_KEY = 'llm_chat_app:v1'

  const rawData = localStorage.getItem(STORAGE_KEY)

  function setActiveChat(id: string | null) {
    chatActiveId.value = id
  }

  if (rawData) {
    try {
      const parsedData = JSON.parse(rawData)
      if (parsedData && parsedData.version === 1) {
        chatsList.value = (parsedData.chats || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          createAt: c.createAt || Date.now(),
          updateAt: c.updateAt || Date.now(),
        }))

        messagesMap.value = parsedData.messagesByChatId || {}
      }
    } catch (e) {
      console.error('Ошибка импорта из localStorage:', e)
    }
  }

  watch(
    [() => chatsList.value, () => messagesMap.value],
    ([newChats, newMessages]) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          chats: newChats,
          messagesByChatId: newMessages,
        }),
      )
    },
    { deep: true },
  )

  const activeChat = computed(() => {
    return chatsList.value.find((chat) => chat.id === chatActiveId.value)
  })

  function createNewChat(chatId: string, firstMessageText: string) {
    const shortTitle = firstMessageText.slice(0, 27) + '...'

    messagesMap.value = {
      ...messagesMap.value,
      [chatId]: [],
    }

    chatsList.value.push({
      id: chatId,
      title: shortTitle,
      createAt: Date.now(),
      updateAt: Date.now(),
    })
  }

  function entryChat(chatId?: string) {
    if (!activeChat.value) return
    activeChat.value.updateAt = Date.now()

    if (chatId && messagesMap.value[chatId]) {
      messagesMap.value[chatId] = [...messagesMap.value[chatId]]
    }
  }

  const currentMessages = computed(() => {
    if (!chatActiveId.value) return []

    return messagesMap.value[chatActiveId.value] || []
  })

  const lastUserMessage = computed(() => {
    return currentMessages.value.at(-2)
  })

  const contextMessages = computed(() => {
    if (!chatActiveId.value) return []
    const currentChatHistory = messagesMap.value[chatActiveId.value]
    const messagesForSend = currentChatHistory.map((el) => {
      return {
        role: el.role,
        content: el.content,
      }
    })
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
      content: params.contentText,
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
  }
})
