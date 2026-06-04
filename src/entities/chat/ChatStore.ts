import { defineStore } from "pinia";
import {useRoute} from "vue-router";
import {computed, ref} from "vue";
import {format} from "date-fns";
import type {chat, message, messagesMap} from "@/entities";

export const useChatStore = defineStore('chatStore', () => {
  const route = useRoute()
  const chatsList = ref<chat[]>([])
  const messagesMap = ref<messagesMap>({})

  const chatActiveId = computed(() => {
    const id = route.params.id
    return (Array.isArray(id) ? id[0] : id) || null
  })

  const activeChat = computed(() => {
    return chatsList.value.find((chat) => chat.id === chatActiveId.value)
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
    if (!chatActiveId.value) return []

    return messagesMap.value[chatActiveId.value] || []
  })

  function getTime() {
    const date = new Date()
    return String(format(date, 'MM:dd'))
  }

  function createNewMessage(
    sender: 'user' | 'assistant',
    contentText: string,
    status: 'sent' | 'pending' | 'error' = 'sent',
    chatId: string,
  ) {
    const linkMessage: message = {
      id: crypto.randomUUID(),
      chatId: chatId,
      role: sender,
      content: contentText,
      createdAt: Date.now(),
      status: status,
      time: getTime(),
    }

    if (!messagesMap.value[chatId]) {
      messagesMap.value = {
        ...messagesMap.value,
        [chatId]: [],
      }
    }

    messagesMap.value[chatId].push(linkMessage)

    return linkMessage
  }

  return {
    messagesMap,
    currentMessages,
    createNewMessage,
    getTime,
    chatsList,
    chatActiveId,
    activeChat,
    createNewChat,
    entryChat }
})