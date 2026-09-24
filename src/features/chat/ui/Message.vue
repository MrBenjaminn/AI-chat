<script setup lang="ts">
import { AccountInfo } from '@/entities/account'
import { useChatStore } from '@/entities/chat/useChatStore'
import { useChatActions } from '@/features/chat/model/useChatActions'
import { useLoginStore } from '@/shared/stores/useLoginStore'
import { useGlobalAppState } from '@/shared/lib/state/useGlobalAppState'
import { ErrorMessage, PreviewFileList } from '@/features/chat'
import { Button, parseMarkdown } from '@/shared'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import TypingIndicator from '@/shared/ui/loader/TypingIndicator.vue'
import { RoleSender } from '@/shared/type/chats'
import { ButtonVariant } from '@/shared/ui/button/model/button'
import CopyText from '@/shared/assets/icons/Copy-Text.svg?component'
import RetryLastUserMessageIcon from '@/shared/assets/icons/Retry-user-message.svg?component'
import {
  PreviewFilesSize,
  PreviewFilesVariant,
} from '@/features/chat/ui/preview-files/model/preview.ts'

const chatStore = useChatStore()
const chatActions = useChatActions()
const loginStore = useLoginStore()
const globalState = useGlobalAppState()

const messagesContainer = ref<HTMLElement | null>(null)

async function handleContainerClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (!target) return

  const copyBtn = target.closest('.markdown-copy-button') as HTMLButtonElement | null
  if (!copyBtn) return

  const codeBlock = copyBtn.closest('.markdown-code-block')
  const codeEl = codeBlock?.querySelector('pre code')
  if (!codeEl) return

  const codeText = codeEl.textContent || ''
  try {
    await navigator.clipboard.writeText(codeText)
    const copyTextSpan = copyBtn.querySelector('.copy-text')
    const originalText = copyTextSpan?.textContent || 'Копировать'
    if (copyTextSpan) copyTextSpan.textContent = 'Скопировано!'
    copyBtn.classList.add('copied')

    setTimeout(() => {
      if (copyTextSpan) copyTextSpan.textContent = originalText
      copyBtn.classList.remove('copied')
    }, 2000)
  } catch (e) {
    console.error('Не удалось скопировать код', e)
  }
}

const lastAssistantMessageId = computed(() => {
  const messages = chatStore.currentMessages
  if (messages.length === 0) return null

  const lastMessage = messages[messages.length - 1]
  return lastMessage.role === RoleSender.assistant ? lastMessage.id : null
})

const showTypingIndicator = computed(() => {
  if (!globalState.isLlmLoading.value) return false
  const messages = chatStore.currentMessages
  if (messages.length === 0) return true
  const lastMessage = messages[messages.length - 1]
  return lastMessage.role === RoleSender.user
})

function scrollThinkingContainers() {
  if (!messagesContainer.value) return
  const openThoughts = messagesContainer.value.querySelectorAll<HTMLElement>(
    '.markdown-thought[open] .markdown-thought-content, .markdown-thought.is-thinking .markdown-thought-content',
  )
  openThoughts.forEach((el) => {
    el.scrollTop = el.scrollHeight
  })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    if (messagesContainer.value.parentElement) {
      messagesContainer.value.parentElement.scrollTop =
        messagesContainer.value.parentElement.scrollHeight
    }
  }
  scrollThinkingContainers()
}

watch(
  [
    () => chatStore.currentMessages.length,
    () => {
      const msgs = chatStore.currentMessages
      if (msgs.length === 0) return 0
      const last = msgs[msgs.length - 1]
      return last.role === RoleSender.assistant ? last.content.length : 0
    },
  ],
  async () => {
    await nextTick()
    scrollToBottom()
    requestAnimationFrame(() => {
      scrollToBottom()
    })
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
    @click="handleContainerClick"
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
      <div
        v-if="item.role === RoleSender.assistant"
        class="ai-chat__text-message ai-chat__markdown-content"
        v-html="parseMarkdown(item.content)"
      />
      <p
        v-else
        class="ai-chat__text-message ai-chat__user-message"
      >
        {{ item.content }}
      </p>
      <ErrorMessage
        :role="item.role"
        :appStatus="item.status"
        :currentMessage="item"
      />
      <div class="ai-chat__buttons">
        <Button
          v-if="item.id === lastAssistantMessageId && !globalState.isLlmLoading.value"
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
          v-if="item.role === RoleSender.assistant && !globalState.isLlmLoading.value"
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
      <TypingIndicator v-if="showTypingIndicator" />
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
  width: calc(100% - 44px);
  box-sizing: border-box;
}

.ai-chat__user-message {
  white-space: pre-wrap;
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
