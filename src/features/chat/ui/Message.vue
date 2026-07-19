<script setup lang="ts">
import {AccountInfo} from '@/entities/account'
import {useChatStore} from '@/entities/chat/useChatStore'
import {useChatActions} from '@/features/chat/model/useChatActions'
import {useLoginStore} from '@/shared/stores/useLoginStore'
import {useGlobalAppState} from '@/shared/lib/state/useGlobalAppState'
import {ErrorMessage, PreviewFileList} from '@/features/chat'
import {Button} from '@/shared'
import {computed, nextTick, onMounted, ref, watch} from 'vue'
import TypingIndicator from '@/shared/ui/loader/TypingIndicator.vue'
import {RoleSender} from '@/shared/type/chats'
import {ButtonVariant} from '@/shared/ui/button/model/button'
import CopyText from '@/shared/assets/icons/Copy-Text.svg?component'
import RetryLastUserMessageIcon
  from '@/shared/assets/icons/Retry-user-message.svg?component'
import {
  PreviewFilesSize,
  PreviewFilesVariant
} from "@/features/chat/ui/preview-files/model/preview.ts";

const chatStore = useChatStore()
const chatActions = useChatActions()
const loginStore = useLoginStore()
const globalState = useGlobalAppState()

const messagesContainer = ref<HTMLElement | null>(null)

const lastAssistantMessageId = computed(() => {
  const messages = chatStore.currentMessages
  if (messages.length === 0) return null

  const lastMessage = messages[messages.length - 1]
  return lastMessage.role === RoleSender.assistant ? lastMessage.id : null
})

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(
  () => chatStore.currentMessages.length,
  async () => {
    await nextTick()
    scrollToBottom()
  },
)

onMounted(async () => {
  await nextTick()
  scrollToBottom()
})

interface Props {
  type?: RoleSender.user | RoleSender.assistant
  depth?: 0 | 1 | 2
}

withDefaults(defineProps<Props>(), {
  type: RoleSender.assistant,
  depth: 0,
})
</script>

<template>
  <div
    ref="messagesContainer"
    class="ai-chat__message-item"
  >
    <div
      class="ai-chat__message"
      :class="{ assistant: item.role === 'assistant' }"
      v-for="item in chatStore.currentMessages"
      :key="item.id"
    >
      <PreviewFileList
        v-if="item.attachments"
        :files="item.attachments"
        :variant="PreviewFilesVariant.Secondary"
        :size="PreviewFilesSize.Default"
      />

      <div class="ai-chat__sender-info">
        <AccountInfo
          size="default"
          :userName="item.role === 'user' ? loginStore.currentUser.name : loginStore.assistant.name"
          :userAvatar="
            item.role === 'user' ? loginStore.currentUser.avatar : loginStore.assistant.avatar
          "
        />
        <span class="ai-chat__sender-date"> {{ item.time }} </span>
      </div>
      <p class="ai-chat__text-message">
        {{ item.content }}
      </p>
      <ErrorMessage
        :role="item.role"
        :appStatus="item.status"
        :currentMessage="item"
      />
      <div class="ai-chat__buttons">
        <Button
          v-if="item.id === lastAssistantMessageId"
          :variant="ButtonVariant.Secondary"
          :size="null"
          label="retry-last-message"
          class="ai-chat__active-button"
          title="Повторно отправить последнее сообщение"
          @click.prevent="chatActions.retryLastUserMessage"
        >
          <RetryLastUserMessageIcon />
        </Button>
        <Button
          v-if="item.role === RoleSender.assistant"
          :variant="ButtonVariant.Secondary"
          :size="null"
          label="copy-text"
          class="ai-chat__active-button"
          title="Копировать сообщение"
          @click.prevent="chatActions.copyMessage(item.content)"
        >
          <CopyText />
        </Button>
      </div>
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

.view-send-files {
  width: max-content;
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

.ai-chat__buttons {
  margin-left: auto;
  display: flex;
}

.ai-chat__active-button {
  color: var(--neutral-color);
}

@media (max-width: 600px) {
  .ai-chat__message-item {
    padding-left: 10px;
  }
}
</style>
