import {apiInstance} from "@/shared/api/base.ts";
import {ref} from "vue";
import { useChatStore } from '@/entities/chat/ChatStore.ts'

export const errorMessage = ref<string>('')
export const isLlmLoading = ref<boolean>(false)

export async function responseApi(text: string, userMsg: any, chatId: string) {
  isLlmLoading.value = true
  errorMessage.value = ''
  const chatStore = useChatStore()

  try {
    const model = import.meta.env.VITE_OPENROUTER_MODEL

    const response = await apiInstance.post('/completions',
      {
        model,
        messages: [{ role: 'user', content: text }],
        reasoning: { enabled: true },
      }
    )

    const aiResponseText = response.data?.choices[0]?.message?.content

    if (!aiResponseText) {
      throw new Error('Некорректный ответ от модели')
    }

    if (userMsg) userMsg.status = 'sent'

    chatStore.createNewMessage('assistant', aiResponseText, 'sent', chatId)
    chatStore.entryChat(chatId)
  } catch (error: any) {
    console.error('Критическая ошибка при запросе:', error)
    errorMessage.value = error.message || 'Не удалось связаться с сервером. Попробуйте позже.'

    if (userMsg) {
      userMsg.status = 'error'
      chatStore.entryChat(chatId)
    }
  } finally {
    isLlmLoading.value = false
  }
}