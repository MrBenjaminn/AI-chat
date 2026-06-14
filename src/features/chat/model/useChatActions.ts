import { computed, ref } from 'vue'
import { useChatStore } from '@/entities/chat/useChatStore.ts'
import { responseApi } from '@/features/chat/api/api.ts'
import { useGlobalAppState } from '@/shared/lib/state/useGlobalAppState.ts'
import { messageStatus, roleSender } from '@/entities/chat/types'
import type { MessageType } from '@/entities/chat'
import { useRoute } from 'vue-router'

export function useChatActions() {
  const chatStore = useChatStore()
  const globalState = useGlobalAppState()
  const route = useRoute()

  const errorMessage = ref<string>('')

  const chatActiveId = computed(() => {
    const id = route.params.id
    return (Array.isArray(id) ? id[0] : id) || null
  })

  async function processSendMessage(text: string, userMsg: any, chatId: string) {
    globalState.isLlmLoading.value = true
    errorMessage.value = ''

    try {
      const responseReq = await responseApi(text)

      if (userMsg) userMsg.status = messageStatus.sent

      chatStore.createNewMessage({
        sender: roleSender.assistant,
        contentText: responseReq,
        status: messageStatus.sent,
        chatId: chatId,
      })
      chatStore.entryChat(chatId)
    } catch (error: any) {
      console.error('Критическая ошибка при запросе:', error)
      errorMessage.value = error.message || 'Не удалось связаться с сервером. Попробуйте позже.'

      if (userMsg) {
        userMsg.status = messageStatus.error
        chatStore.entryChat(chatId)
      }
    } finally {
      globalState.isLlmLoading.value = false
    }
  }

  async function sendAsk(textToSend: string) {
    if (!textToSend.trim()) return

    const currentId = chatActiveId.value as string

    let userMessageObj = chatStore.createNewMessage({
      sender: roleSender.user,
      contentText: textToSend,
      status: messageStatus.pending,
      chatId: currentId,
    })
    chatStore.entryChat(currentId)
    await processSendMessage(textToSend, userMessageObj, currentId)
  }

  async function retrySend(failedMessageObj: MessageType) {
    if (globalState.isLlmLoading.value) return

    const chatId = chatActiveId.value as string
    if (!chatId) return

    failedMessageObj.status = messageStatus.pending

    errorMessage.value = ''

    await processSendMessage(failedMessageObj.content, failedMessageObj, chatId)
  }

  function scrollToBottom() {
    const messagesContainer = ref<HTMLElement | null>(null)

    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }

  return { errorMessage, sendAsk, retrySend, scrollToBottom, chatActiveId }
}
