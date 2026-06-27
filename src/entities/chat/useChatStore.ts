import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { format } from 'date-fns'
import type {
  Chat,
  MessageType,
  MessagesMap,
  createMessageParams, Attachments,
} from '@/entities/chat/index.ts'
import {finalBase64Url} from "@/pages/login/model/generationService.ts";

export const useChatStore = defineStore('chatStore', () => {
  const chatsList = ref<Chat[]>([])
  const messagesMap = ref<MessagesMap>({})
  const files = ref<Attachments[]>([])
  const chatActiveId = ref<string | null>('')

  const STORAGE_KEY = 'llm_chat_app:v1'

  const rawData = localStorage.getItem(STORAGE_KEY)

  function setActiveChat(id: string | null) {
    chatActiveId.value = id
  }

  if (rawData) {
    try {
      const parsedData = JSON.parse(rawData)
      if (parsedData && parsedData.version === 1) {
        chatsList.value = (parsedData.chats || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          createAt: c.createAt || Date.now(),
          updateAt: c.updateAt || Date.now(),
        }))

        messagesMap.value = parsedData.messagesByChatId || {}
      }
    } catch (e) {
      console.error('Ошибка импорта из localStorage:', e)
    }
  }

  watch(
    [() => chatsList.value, () => messagesMap.value],
    ([newChats, newMessages]) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          chats: newChats,
          messagesByChatId: newMessages,
        }),
      )
    },
    { deep: true },
  )

  const activeChat = computed(() => {
    return chatsList.value.find((Chat) => Chat.id === chatActiveId.value)
  })

  function createNewChat(id: string, firstMessageText: string) {
    const shortTitle = firstMessageText.slice(0, 27) + '...'

    messagesMap.value = {
      ...messagesMap.value,
      [id]: [],
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

    if (chatId && messagesMap.value[chatId]) {
      messagesMap.value[chatId] = [...messagesMap.value[chatId]]
    }
  }

  const currentMessages = computed(() => {
    if (!chatActiveId.value) return []

    return messagesMap.value[chatActiveId.value] || []
  })

  function getTime() {
    const date = new Date()
    return String(format(date, 'HH:mm'))
  }

  function createNewMessage(params: createMessageParams) {

    const linkMessage: MessageType = {
      attachments: files.value,
      id: crypto.randomUUID(),
      chatId: params.chatId,
      role: params.sender,
      content: params.contentText,
      createdAt: Date.now(),
      status: params.status,
      time: getTime(),
    }

    if (!messagesMap.value[params.chatId]) {
      messagesMap.value = {
        ...messagesMap.value,
        [params.chatId]: [],
      }
    }

    messagesMap.value[params.chatId].push(linkMessage)

    return linkMessage
  }

  function currentTypeFile (file: File) {
    if (file.type.startsWith('audio/')) return  'audio';
    if (file.type.startsWith('video/')) return  'video';
    if (file.type.includes('pdf')) return 'file';
    if (file.type.startsWith('image/')) return  'image';
    return null;
  }

  function readFiles (file: File): Promise<string> {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = () => {

        const result = reader.result as string;
        const interResult = result.split(',')[1]
        const resultAudio = finalBase64Url(interResult)
        const resultAnotherFiles = finalBase64Url(result)

        if (currentTypeFile(file) === 'audio') {
          resolve(resultAudio);
        } else {
          resolve(resultAnotherFiles);
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  }

  async function handleAddFile(event: Event) {
    const currentFile = event.target as HTMLInputElement


    if (currentFile.files) {

      for (const file of Array.from(currentFile.files)) {

        const preview = URL.createObjectURL(file);
        const kindType = currentTypeFile(file)
        const currentBase = await readFiles(file)
        if(!kindType) return


        const newItem: Attachments = {
          id: crypto.randomUUID(),
          kind: kindType,
          mimeType: file.type,
          fileName: file.name,
          size: file.size,
          source: {
            type: 'base64',
            value: currentBase,
          },
          previewUrl: preview
        }

        files.value.push(newItem)
      }
    }
  }

  function deletePreviewFile(id: string) {
    const currentIndexFile = files.value.findIndex((e) => e.id === id)
    files.value.splice(currentIndexFile, 1)
  }

  return {
    messagesMap,
    currentMessages,
    createNewMessage,
    chatsList,
    activeChat,
    createNewChat,
    entryChat,
    files,
    handleAddFile,
    deletePreviewFile,
    setActiveChat,
    chatActiveId
  }
})
