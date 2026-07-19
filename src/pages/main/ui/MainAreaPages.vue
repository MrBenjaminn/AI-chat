<script setup lang="ts">
import { EmptyChat, HeaderMainArea } from '@/features/chat'
import { CloseSidebarOverlay, SideBar } from '@/widgets/sidebar'
import { ChatPages } from '@/widgets/chatpage'
import { useChatStore } from '@/entities/chat/useChatStore.ts'
import { onUnmounted, watch } from 'vue'
import { clearPreviewUrl } from '@/shared/lib/file/clearPreviewUrl'
import { useRoute, useRouter } from 'vue-router'
import { RouteNames } from '@/shared'

const chatStore = useChatStore()
const route = useRoute()
const router = useRouter()

onUnmounted(() => {
  clearPreviewUrl(chatStore.files)
})

watch(
  () => route.params.id,
  () => {
    clearPreviewUrl(chatStore.files)
    chatStore.files = []
  },
)

watch(
  () => route.params.id,
  async (newId) => {

    if (route.name === RouteNames.homePage) {
      chatStore.setActiveChat(null)
      return
    }

    const chat = chatStore.chatsList.find((chat) => chat.id === newId)

    if (!chat) {
      await router.push({ name: RouteNames.homePage })
      return
    }

    const id = (Array.isArray(newId) ? newId[0] : newId) || null
    chatStore.setActiveChat(id)
  },
  { immediate: true },
)
</script>

<template>
  <SideBar />
  <main class="main-area-wrapper">
    <CloseSidebarOverlay />
    <HeaderMainArea />
    <component :is="chatStore.chatActiveId ? ChatPages : EmptyChat" />
  </main>
</template>

<style lang="css" scoped>
.main-area-wrapper {
  position: relative;
  grid-column: 2;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px 0 rgba(25, 33, 61, 0.1);
  border-radius: var(--regular-radius);
  height: 98vh;
  background-color: var(--light-color);
  background-image: url('@shared/assets/images/Background-Wrapper-Chat.svg');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

@media (max-width: 760px) {
  .main-area-wrapper {
    height: 100vh;
  }
}
</style>
