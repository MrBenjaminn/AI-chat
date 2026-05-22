<script setup lang="ts">
import { useMessageStore } from './Model/MessageStore'
import { AccountInfo } from '@/entities'
import { ref, watch, onMounted, nextTick } from 'vue'
import { storeData } from "@/store";
import { useChatActions } from "@/features/SendMessage/model/ChatActions";
import TypingIndicator from "@/TypingIndicator.vue";
import ErrorMessage from "@/ErrorMessage.vue";

const store = storeData()
const messages = useMessageStore()
const chatActions = useChatActions()

const messagesContainer = ref<HTMLElement | null>(null)
function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(
  () => messages.currentMessages,
  async () => {
    await nextTick()
    scrollToBottom()
  },
  { deep: true },
)

onMounted(async () => {
  await nextTick()
  scrollToBottom()
})

interface Props {
  type?: 'user' | 'assistant';
  depth?: 0 | 1 | 2;
}

withDefaults(defineProps<Props>(), {
  type: 'assistant',
  depth: 0,
});

</script>

<template>
  <div
    ref="messagesContainer"
    class="ai-chat__message-item"
  >
    <div
      class="ai-chat__message"
      :class="item.role === 'assistant' ? 'assistant' : null"
      v-for="item in messages.currentMessages"
      :key="item.id"
    >
      <div class="ai-chat__sender-info">
        <AccountInfo
          style="column-gap: 12px"
          :userInfo="item.role === 'user' ? store.currentUser : store.assistant"
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
      <TypingIndicator v-if="chatActions.isLlmLoading" />
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
