<script setup lang="ts">
import { Message } from '@/features/chat'
import { SendMessage } from '@/features/chat'
import { format } from 'date-fns'
import { computed } from 'vue'
import { useChatStore } from '@/entities/chat/useChatStore.ts'

const chatStore = useChatStore()

const currentCreateChatTime = computed(() => {
  const currentTimeStep = chatStore.activeChat?.createAt
  const dateString = format(new Date(currentTimeStep), 'dd.MM.yyyy HH:mm')
  return dateString
})
</script>

<template>
  <div class="ai-chat">
    <span class="ai-chat__date"> Create {{ currentCreateChatTime }} PM </span>
    <Message />
    <SendMessage />
  </div>
</template>

<style lang="css" scoped>
.ai-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 40px;
  padding: 30px clamp(120px, 19.44vw, 280px);
  background-color: var(--light-color);
  border-radius: var(--regular-radius);

  height: 100%;
  max-height: 100%;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  min-height: 0;

  overflow: auto;
}

.ai-chat__date {
  font-size: var(--small-font-size);
  color: var(--neutral-color);
  font-weight: 400;
  display: flex;
  align-items: center;
  text-align: center;
  column-gap: 16px;
  width: 100%;
  max-width: 900px;
}

.ai-chat__date:before,
.ai-chat__date:after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

@media (max-width: 1280px) {
  .ai-chat {
    padding: 40px 80px;
  }
}

@media (max-width: 1000px) {
  .ai-chat {
    padding: 30px 40px;
  }
}

@media (max-width: 768px) {
  .ai-chat {
    padding: 30px clamp(15px, 4.5vw, 30px);
  }
}

@media (max-width: 630px) {
  .ai-chat {
    padding: 20px 0 0 0;
  }
}
</style>
