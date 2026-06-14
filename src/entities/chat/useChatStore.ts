import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { format } from 'date-fns'
import { useChatActions } from '@/features/chat/model/useChatActions.ts'
import type { Chat, MessageType, MessagesMap, createMessageParams } from '@/entities/chat/index.ts'

export const useChatStore = defineStore('chatStore', () => {
  const chatsList = ref<Chat[]>([])
  const messagesMap = ref<MessagesMap>({})
  const chatActions = useChatActions()

  const STORAGE_KEY = 'llm_chat_app:v1'

  const rawData = localStorage.getItem(STORAGE_KEY)

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
    return chatsList.value.find((Chat) => Chat.id === chatActions.chatActiveId.value)
  })

  function createNewChat(id: string, firstMesageText: string) {
    const shortTitle = firstMesageText.slice(0, 27) + '...'

    messagesMap.value = {
      ...messagesMap.value,
      [id]: [],
    }

    chatsList.value.push({
      id: id,
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
    if (!chatActions.chatActiveId.value) return []

    return messagesMap.value[chatActions.chatActiveId.value] || []
  })

  function getTime() {
    const date = new Date()
    return String(format(date, 'HH:mm'))
  }

  function createNewMessage(params: createMessageParams) {
    const linkMessage: MessageType = {
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
  }
})
