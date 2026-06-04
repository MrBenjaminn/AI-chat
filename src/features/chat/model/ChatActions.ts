import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useChatStore } from '@/entities/chat/ChatStore.ts'
import {responseApi, errorMessage, isLlmLoading} from '@/features/chat/api/api.ts'



export const useChatActions = defineStore('chatActions', () => {
  const router = useRouter()
  const chatStore = useChatStore()

  const llmAskText = ref<string>('')

  async function sendAsk() {
    const textToSend = llmAskText.value
    if (!textToSend.trim()) return

    let userMessageObj
    const currentId = chatStore.chatActiveId

    llmAskText.value = ''

    if (currentId === null) {
      const newId = crypto.randomUUID()
      chatStore.createNewChat(newId, textToSend)
      userMessageObj = chatStore.createNewMessage('user', textToSend, 'pending', newId)
      await router.push(`/chat/${newId}`)
      responseApi(textToSend, userMessageObj, newId)
    } else {
      const safeId = currentId as string
      userMessageObj = chatStore.createNewMessage('user', textToSend, 'pending', safeId)
      chatStore.entryChat(safeId)
      responseApi(textToSend, userMessageObj, safeId)
    }
  }

  async function retrySend(failedMessageObj: any) {
    if (isLlmLoading.value) return

    const chatId = chatStore.chatActiveId
    if (!chatId) return

    failedMessageObj.status = 'pending'

    errorMessage.value = ''

    await responseApi(failedMessageObj.content, failedMessageObj, chatId)
  }

  return { isLlmLoading, errorMessage, llmAskText, sendAsk, retrySend }
})
