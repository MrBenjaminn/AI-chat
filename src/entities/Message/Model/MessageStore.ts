import { defineStore } from "pinia";
import { ref, computed } from 'vue'
import type { messagesMap } from "@/entities";
import type { message } from "@/entities";
import { useChatStore } from "@/entities/ChatHistory/model/chatStore.ts";

export const useMessageStore = defineStore('messages', () => {
  const messagesMap = ref<messagesMap>({})
  const id = useChatStore()

  const currentMessages = computed(() => {
    if (!id.chatActiveId) return []

    return messagesMap.value[id.chatActiveId] || []
  })

  function getTime() {
    const date = new Date()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  function createNewMessage(
    sender: 'user' | 'assistant',
    contentText: string,
    status: 'sent' | 'pending' | 'error' = 'sent',
    chatId: string
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
        [chatId]: []
      }
    }

    messagesMap.value[chatId].push(linkMessage)

    return linkMessage
  }

  return { messagesMap, currentMessages, getTime, createNewMessage }
})