<script setup lang="ts">
import { EmptyChat, HeaderMainArea } from '@/features/chat'
import { CloseSidebarOverlay, SideBar } from '@/widgets/sidebar'
import { useChatActions } from '@/features/chat/model/useChatActions.ts'
import { ChatPages } from '@/widgets/chatpage'

const chatActions = useChatActions()
</script>

<template>
  <SideBar />
  <main class="main-area-wrapper">
    <CloseSidebarOverlay />
    <HeaderMainArea />
    <component :is="chatActions.chatActiveId.value ? ChatPages : EmptyChat" />
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
