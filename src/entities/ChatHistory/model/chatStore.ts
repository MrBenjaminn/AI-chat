import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { chat } from './types'
import { useMessageStore } from "@/entities/Message/Model/MessageStore.ts";

export const useChatStore = defineStore('chat', () => {
  const route = useRoute()
  const messages = useMessageStore()
  const chatsList = ref<chat[]>([])

  const chatActiveId = computed(() => {
    const id = route.params.id
    return (Array.isArray(id) ? id[0] : id) || null
  })

  const activeChat = computed(() => {
    return chatsList.value.find((chat) => chat.id === chatActiveId.value)
  })

  function createNewChat(id: string, firstMesageText: string) {
    const shortTitle = firstMesageText.slice(0, 27) + '...'

    messages.messagesMap = {
      ...messages.messagesMap,
      [id]: []
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

    if (chatId && messages.messagesMap[chatId]) {
      messages.messagesMap[chatId] = [...messages.messagesMap[chatId]]
    }
  }

  return { chatsList, chatActiveId, activeChat, createNewChat, entryChat }
})