import { computed, ref } from 'vue'
import { useChatStore } from '@/entities/chat/useChatStore'
import { responseApiStream } from '@/features/chat/api/api'
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
  let currentAbortController: AbortController | null = null

  const isSubmitDisabled = computed(() => {
    return Boolean(globalState.isLlmLoading.value || !llmAskText.value.trim())
  })

  function stopGenerating() {
    if (currentAbortController) {
      currentAbortController.abort()
      currentAbortController = null
      globalState.isLlmLoading.value = false
    }
  }

  async function modelResponseRequest(
    textUserMsg: string,
    objUserMsg: MessageType,
    fileBase: FileRaw[],
    files: Attachments[],
    chatId: string,
  ) {
    globalState.isLlmLoading.value = true
    errorMessage.value = ''

    if (currentAbortController) {
      currentAbortController.abort()
    }
    currentAbortController = new AbortController()

    const assistantMsgRef = { value: null as MessageType | null }

    try {
      await responseApiStream(
        textUserMsg,
        fileBase,
        files,
        chatStore.contextMessages,
        (chunk) => {
          if (!assistantMsgRef.value) {
            assistantMsgRef.value = chatStore.createNewMessage({
              sender: RoleSender.assistant,
              contentText: chunk,
              status: messageStatus.pending,
              chatId: chatId,
            })
            if (objUserMsg) objUserMsg.status = messageStatus.sent
          } else {
            assistantMsgRef.value.content += chunk
          }
          chatStore.entryChat(chatId)
        },
        currentAbortController.signal,
      )

      if (assistantMsgRef.value) {
        assistantMsgRef.value.status = messageStatus.sent
      }
      if (objUserMsg) {
        objUserMsg.status = messageStatus.sent
      }
      chatStore.entryChat(chatId)
      chatStore.saveToStorage()
    } catch (error: any) {
      if (error.name === 'AbortError') {
        if (assistantMsgRef.value) {
          assistantMsgRef.value.status = messageStatus.sent
        }
        chatStore.entryChat(chatId)
        chatStore.saveToStorage()
        return
      }

      console.error('Критическая ошибка при запросе:', error)
      errorMessage.value = error.message || 'Не удалось связаться с сервером. Попробуйте позже.'

      if (objUserMsg) {
        objUserMsg.status = messageStatus.error
      }
      if (assistantMsgRef.value) {
        assistantMsgRef.value.status = messageStatus.error
      }
      chatStore.entryChat(chatId)
      chatStore.saveToStorage()
    } finally {
      globalState.isLlmLoading.value = false
      currentAbortController = null
    }
  }

  async function createUserMessage(
    textToSend: string,
    files: Attachments[],
    targetChatId?: string,
  ) {
    if (!textToSend.trim() && files.length === 0) return

    const currentId = targetChatId || chatStore.chatActiveId
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

    const chatId = failedMessageObj.chatId || chatStore.chatActiveId
    if (!chatId) return
    const files = failedMessageObj.attachments || []

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

    const textToSend = llmAskText.value
    if (!textToSend.trim() && chatStore.files.length === 0) return

    const filesToSend = [...chatStore.files]
    llmAskText.value = ''

    clearPreviewUrl(chatStore.files)

    chatStore.files = []

    const isNewChat =
      !chatStore.chatActiveId || router.currentRoute.value.name === RouteNames.homePage

    if (isNewChat) {
      const newIdChat = crypto.randomUUID()
      chatStore.createNewChat(newIdChat, textToSend)
      await router.push({ name: RouteNames.chat, params: { id: newIdChat } })
      await createUserMessage(textToSend, filesToSend, newIdChat)
    } else {
      const activeId = chatStore.chatActiveId
      if (activeId) {
        await createUserMessage(textToSend, filesToSend, activeId)
      }
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
    stopGenerating,
  }
}
