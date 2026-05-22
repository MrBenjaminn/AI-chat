import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import {ref} from "vue";
import { useChatStore } from "@/entities/ChatHistory/model/chatStore";
import { useMessageStore } from "@/entities/Message/Model/MessageStore.ts";

export const useChatActions = defineStore('chatActions', () => {
  const router = useRouter();
  const chats = useChatStore();
  const messages = useMessageStore();

  const errorMessage = ref<string>('')
  const isLlmLoading = ref<boolean>(false)
  const llmAskText = ref<string>('')

  async function responseApi(text: string, userMsg: any, chatId: string) {
    isLlmLoading.value = true
    errorMessage.value = ''

    try {
      const api = import.meta.env.VITE_OPENROUTER_API_KEY
      const model = import.meta.env.VITE_OPENROUTER_MODEL
      const baseUrl = import.meta.env.VITE_OPENROUTER_BASE_URL
      const openRouterTitle = import.meta.env.VITE_OPENROUTER_APP_TITLE
      const referer = import.meta.env.VITE_OPENROUTER_APP_URL

      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${api}`,
          'HTTP-Referer': `${referer}`,
          'X-OpenRouter-Title': `${openRouterTitle}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: `${model}`,
          messages: [{role: 'user', content: text}],
          reasoning: { enabled: true },
        }),
      })

      if (!response.ok) {
        throw new Error(`Ошибка сервера: статус ${response.status}`)
      }

      const result = await response.json()
      const aiResponseText = result?.choices[0]?.message?.content

      if (!aiResponseText) {
        throw new Error('Некорректный ответ от модели')
      }

      if (userMsg) userMsg.status = 'sent'

      messages.createNewMessage('assistant', aiResponseText, 'sent', chatId)
      chats.entryChat(chatId)
    } catch (error: any) {
      console.error('Критическая ошибка при запросе:', error)
      errorMessage.value = error.message || 'Не удалось связаться с сервером. Попробуйте позже.'

      if (userMsg) {
        userMsg.status = 'error'
        chats.entryChat(chatId)
      }
    } finally {
      isLlmLoading.value = false
    }
  }

  async function sendAsk() {

    const textToSend = llmAskText.value
    if (!textToSend.trim()) return

    let userMessageObj
    const currentId = chats.chatActiveId

    llmAskText.value = ''

    if (currentId === null) {
      const newId = crypto.randomUUID()
      chats.createNewChat(newId, textToSend)
      userMessageObj = messages.createNewMessage('user', textToSend, 'pending', newId)
      await router.push(`/chat/${newId}`)
      responseApi(textToSend, userMessageObj, newId)
    } else {
      const safeId = currentId as string
      userMessageObj = messages.createNewMessage('user', textToSend, 'pending', safeId)
      chats.entryChat(safeId)
      responseApi(textToSend, userMessageObj, safeId)
    }

  }

  async function retrySend(failedMessageObj: any) {

    if (isLlmLoading.value) return

    const chatId = chats.chatActiveId
    if (!chatId) return

    failedMessageObj.status = 'pending'

    errorMessage.value = ''

    await responseApi(failedMessageObj.content, failedMessageObj, chatId)
  }

  return { isLlmLoading, errorMessage, llmAskText, sendAsk, retrySend }
})