<script setup lang="ts">
import './styles'
import { MainAreaPages } from '@/pages'
import { watch } from 'vue'
import { SideBar } from '@/widgets'
import { useChatStore } from '@/entities/ChatHistory/model/chatStore'
import { useMessageStore } from "@/entities/Message/Model/MessageStore.ts"


const chatStore = useChatStore()
const messageStore = useMessageStore()
const STORAGE_KEY = 'llm_chat_app:v1'

const rawData = localStorage.getItem(STORAGE_KEY)
if (rawData) {
  try {
    const parsedData = JSON.parse(rawData)
    if (parsedData && parsedData.version === 1) {

      chatStore.chatsList = (parsedData.chats || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        createAt: c.createAt || Date.now(),
        updateAt: c.updateAt || Date.now()
      }))

      messageStore.messagesMap = parsedData.messagesByChatId || {}
    }
  } catch (e) {
    console.error('Ошибка импорта из localStorage:', e)
  }
}

watch(
    [() => chatStore.chatsList, () => messageStore.messagesMap],
    ([newChats, newMessages]) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 1,
        chats: newChats,
        messagesByChatId: newMessages
      }))
    },
    { deep: true }
)

</script>

<template>
  <div class="global-wrapper">
    <SideBar />
    <MainAreaPages />
  </div>
</template>

<style lang="css" scoped>
.global-wrapper {
  position: relative;
  display: grid;
  grid-template-columns: 296px 1fr;
  max-height: 100dvh;
  width: 100%;
  padding: 10px 10px 10px 0;
  transition: grid-template-columns 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.global-wrapper:has(.side-bar-out) {
  grid-template-columns: 80px 1fr;
}

@media (max-width: 760px) {
  .global-wrapper {
    overflow: hidden;
    padding: 0;
    grid-template-columns: 296px 1fr;
  }

  .global-wrapper:has(.side-bar-out) {
    grid-template-columns: 0 1fr;
  }
}
</style>
