<script setup lang="ts">
import { AccountInfo } from '@/entities/account'
import { useChatStore } from '@/entities/chat/useChatStore.ts'
import { useAuth } from '@/shared/stores/authStore.ts'
import { useGlobalAppState } from '@/shared/lib/state/useGlobalAppState.ts'
import { ErrorMessage } from '@/features/chat'
import { watch, onMounted, nextTick } from 'vue'
import TypingIndicator from '@/shared/ui/loader/TypingIndicator.vue'
import { roleSender } from '@/entities/chat/types'
import { useChatActions } from '@/features/chat/model/useChatActions.ts'

const chatStore = useChatStore()
const auth = useAuth()
const globalState = useGlobalAppState()
const chatActions = useChatActions()

watch(
  () => chatStore.currentMessages.length,
  async () => {
    await nextTick()
    chatActions.scrollToBottom()
  },
)

onMounted(async () => {
  await nextTick()
  chatActions.scrollToBottom()
})

interface Props {
  type?: roleSender.user | roleSender.assistant
  depth?: 0 | 1 | 2
}

withDefaults(defineProps<Props>(), {
  type: roleSender.assistant,
  depth: 0,
})
</script>

<template>
  <div
    ref="messagesContainer"
    class="ai-chat__message-item"
  >
    <div
      :class="{ 'ai-chat__message--assistant': item.role === 'assistant' }"
      v-for="item in chatStore.currentMessages"
      :key="item.id"
    >
      <div class="ai-chat__sender-info">
        <AccountInfo
          size="account--default"
          :userName="item.role === 'user' ? auth.currentUser.name : auth.assistant.name"
          :userAvatar="item.role === 'user' ? auth.currentUser.avatar : auth.assistant.avatar"
        />
        <span class="ai-chat__sender-date"> {{ item.time }} PM </span>
      </div>
      <p class="ai-chat__text-message">
        {{ item.content }}
      </p>
      <ErrorMessage
        :role="item.role"
        :appStatus="item.status"
        :currentMessage="item"
      />
    </div>

    <transition name="fade">
      <TypingIndicator v-if="globalState.isLlmLoading.value" />
    </transition>
  </div>
</template>

<style lang="css" scoped>
.ai-chat__message-item {
  display: flex;
  flex-direction: column;
  row-gap: 40px;
  align-items: start;

  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 900px;

  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cccccc transparent;
}

.assistant {
  padding: var(--medium-padding);
  border-radius: var(--regular-radius);
  border: 1px solid var(--border-color);
}

.ai-chat__message {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  width: 100%;
  border-radius: var(--regular-radius);
}

.ai-chat__text-message {
  color: var(--neutral-color);
  font-weight: 400;
  line-height: 1.5;
  margin-left: 44px;
}

.ai-chat__sender-info {
  display: flex;
  column-gap: 12px;
  align-items: center;
}

.ai-chat__sender-date {
  font-size: var(--small-font-size);
  color: var(--neutral-color);
  position: relative;
  margin-left: 12px;
}

.ai-chat__sender-date:before {
  content: '';
  position: absolute;
  height: 100%;
  width: 1px;
  background-color: var(--border-color);
  left: -12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .ai-chat__message-item {
    padding-left: 10px;
  }
}
</style>
