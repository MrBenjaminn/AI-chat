import { computed, ref } from 'vue'
import { useChatStore } from '@/entities/chat/useChatStore'
import { responseApi } from '@/features/chat/api/api'
import { useGlobalAppState } from '@/shared/lib/state/useGlobalAppState'
import {
  type Attachments,
  type MessageType,
  messageStatus,
  RoleSender,
  type FileRaw,
} from '@/shared/type/chats'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/shared'
import { clearPreviewUrl } from '@/shared/lib/file/clearPreviewUrl'

export function useChatActions() {
  const chatStore = useChatStore()
  const globalState = useGlobalAppState()
  const router = useRouter()

  const errorMessage = ref<string>('')
  const llmAskText = ref<string>('')

  const isSubmitDisabled = computed(() => {
    return Boolean(globalState.isLlmLoading.value || !llmAskText.value.trim())
  })

  async function modelResponseRequest(
    textUserMsg: string,
    objUserMsg: MessageType,
    fileBase: FileRaw[],
    files: Attachments[],
    chatId: string,
  ) {
    globalState.isLlmLoading.value = true
    errorMessage.value = ''

    try {
      const responseReq = await responseApi(textUserMsg, fileBase, files, chatStore.contextMessages)

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

    const currentId = chatStore.chatActiveId
    if (!currentId) return

    const filesDataForMessage = files.map((file) => {
      return {
        id: file.id,
        kind: file.kind,
        mimeType: file.mimeType,
        fileName: file.fileName,
        size: file.size,
      }
    })

    const userMessageObj = chatStore.createNewMessage({
      files: filesDataForMessage,
      sender: RoleSender.user,
      contentText: textToSend,
      status: messageStatus.pending,
      chatId: currentId,
    })

    chatStore.entryChat(currentId)
    await modelResponseRequest(textToSend, userMessageObj, chatStore.filesSource, files, currentId)
  }

  async function retrySend(failedMessageObj: MessageType) {
    if (globalState.isLlmLoading.value) return

    const chatId = chatStore.chatActiveId
    if (!chatId) return
    const files = failedMessageObj.attachments
    if (!files) return

    failedMessageObj.status = messageStatus.pending

    errorMessage.value = ''

    await modelResponseRequest(
      failedMessageObj.content,
      failedMessageObj,
      chatStore.filesSource,
      files,
      chatId,
    )
  }

  async function sendMessage() {
    if (globalState.isLlmLoading.value) return
    const currentChatId = chatStore.chatActiveId

    const textToSend = llmAskText.value

    const filesToSend = [...chatStore.files]
    llmAskText.value = ''

    clearPreviewUrl(chatStore.files)

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
    isSubmitDisabled,
  }
}
