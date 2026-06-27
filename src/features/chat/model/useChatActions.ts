import { ref, watch } from 'vue'
import { useChatStore } from '@/entities/chat/useChatStore'
import { responseApi } from '@/features/chat/api/api'
import { useGlobalAppState } from '@/shared/lib/state/useGlobalAppState'
import {
  type Attachments,
  messageStatus,
  roleSender
} from '@/entities/chat/types'
import type { MessageType } from '@/entities/chat'
import { useRoute, useRouter } from 'vue-router'
import {RouteNames} from "@/shared";

export function useChatActions() {
  const chatStore = useChatStore()
  const globalState = useGlobalAppState()
  const route = useRoute()
  const router = useRouter()

  const errorMessage = ref<string>('')
  const llmAskText = ref<string>('')

  watch(
    () => route.params.id,
    (newId) => {
    const id = (Array.isArray(newId) ? newId[0] : newId) || null
    chatStore.setActiveChat(id)
    },
    { immediate: true }
  )

  async function modelResponseRequest(text: string, userMsg: any, chatId: string) {
    globalState.isLlmLoading.value = true
    errorMessage.value = ''

    try {
      const responseReq = await responseApi(text, chatStore.files)

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

  async function createUserMessage(textToSend: string, file: Attachments[]) {
    if (!textToSend.trim() && file.length === 0) return

    const currentId = chatStore.chatActiveId as string

    let userMessageObj = chatStore.createNewMessage({
      files: file,
      sender: roleSender.user,
      contentText: textToSend,
      status: messageStatus.pending,
      chatId: currentId,
    })
    chatStore.entryChat(currentId)
    await modelResponseRequest(textToSend, userMessageObj, currentId)
  }

  async function retrySend(failedMessageObj: MessageType) {
    if (globalState.isLlmLoading.value) return

    const chatId = chatStore.chatActiveId as string
    if (!chatId) return

    failedMessageObj.status = messageStatus.pending

    errorMessage.value = ''

    await modelResponseRequest(failedMessageObj.content, failedMessageObj, chatId)
  }

  async function sendMessage() {
    const currentChatId = chatStore.chatActiveId
    const text = llmAskText.value
    const file = chatStore.files
    llmAskText.value = ''
    chatStore.files = []
    if (!currentChatId) {
      const newIdChat = crypto.randomUUID()
      chatStore.createNewChat(newIdChat, text)
      await router.push({ name: RouteNames.chat, params: { id: newIdChat } })
      await createUserMessage(text, file)
    } else {
      await createUserMessage(text, file)
    }
  }

  return {
    createUserMessage,
    retrySend,
    sendMessage,
    llmAskText,
    errorMessage,
  }
}
