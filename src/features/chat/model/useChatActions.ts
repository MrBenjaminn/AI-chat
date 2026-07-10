import { ref, watch } from 'vue'
import { useChatStore } from '@/entities/chat/useChatStore'
import { responseApi } from '@/features/chat/api/api'
import { useGlobalAppState } from '@/shared/lib/state/useGlobalAppState'
import { type Attachments, messageStatus, RoleSender } from '@/entities/chat/types'
import type { MessageType } from '@/entities/chat'
import { useRoute, useRouter } from 'vue-router'
import { RouteNames } from '@/shared'

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
    { immediate: true },
  )

  async function modelResponseRequest(
    textUserMsg: string,
    objUserMsg: MessageType,
    chatId: string,
  ) {
    globalState.isLlmLoading.value = true
    errorMessage.value = ''

    try {
      const responseReq = await responseApi(textUserMsg, chatStore.files)

      if (objUserMsg) objUserMsg.status = messageStatus.sent

      chatStore.createNewMessage({
        sender: RoleSender.assistant,
        contentText: responseReq,
        status: messageStatus.sent,
        chatId: chatId,
      })
      chatStore.entryChat(chatId)
    } catch (error: any) {
      console.error('Критическая ошибка при запросе:', error)
      errorMessage.value = error.message || 'Не удалось связаться с сервером. Попробуйте позже.'

      if (objUserMsg) {
        objUserMsg.status = messageStatus.error
        chatStore.entryChat(chatId)
      }
    } finally {
      globalState.isLlmLoading.value = false
    }
  }

  async function createUserMessage(textToSend: string, files: Attachments[]) {
    if (!textToSend.trim() && files.length === 0) return

    const currentId = chatStore.chatActiveId as string

    let userMessageObj = chatStore.createNewMessage({
      files: files,
      sender: RoleSender.user,
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

    const textToSend = llmAskText.value

    const filesToSend = [...chatStore.files]
    llmAskText.value = ''
    chatStore.files.forEach((file) => {
      if (!file.previewUrl) return
      URL.revokeObjectURL(file.previewUrl)
    })
    chatStore.files = []
    if (!currentChatId) {
      const newIdChat = crypto.randomUUID()
      chatStore.createNewChat(newIdChat, textToSend)
      await router.push({ name: RouteNames.chat, params: { id: newIdChat } })
      await createUserMessage(textToSend, filesToSend)
    } else {
      await createUserMessage(textToSend, filesToSend)
    }
  }

  async function retryLastUserMessage() {
    const message = chatStore.lastUserMessage
    if (!message) return
    if (message.role === RoleSender.user) {
      llmAskText.value = message.content
      await sendMessage()
    }
  }

  async function copyMessage(text: string) {
    await navigator.clipboard.writeText(text)
  }

  return {
    createUserMessage,
    retrySend,
    sendMessage,
    llmAskText,
    errorMessage,
    copyMessage,
    retryLastUserMessage,
  }
}
