<script setup lang="ts">
import { useChatActions } from '@features/chat/model/useChatActions.js'
import { useGlobalAppState } from '@shared/lib/state/useGlobalAppState.js'
import iconRetrySend from '@shared/assets/icons/RetrySend.svg?component'
import type { MessageType } from 'entities/chat'

defineProps<{
  role?: string
  appStatus?: string
  currentMessage?: MessageType
}>()
const chatActions = useChatActions()
const globalState = useGlobalAppState()
</script>

<template>
  <div
    v-if="role === 'user' && appStatus === 'error'"
    class="error-delivery-zone"
  >
    <span class="error-delivery-text">Произошла ошибка</span>
    <button
      @click="chatActions.retrySend(currentMessage)"
      class="retry-action-btn"
      :disabled="globalState.isLlmLoading.value"
    >
      <iconRetrySend />
    </button>
  </div>
</template>

<style lang="css" scoped>
.error-delivery-zone {
  display: flex;
  align-items: center;
  column-gap: 8px;

  font-size: 12px;
  font-family: sans-serif;
  border: 1px solid var(--border-color);
  border-radius: var(--regular-radius);
  padding: 10px;
  align-self: flex-start;
}

.error-delivery-text {
  color: var(--neutral-color);
}

.retry-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  padding: 0;
  text-decoration: underline;
  transition: color 0.2s ease;
  color: var(--neutral-color);
}

.retry-action-btn:hover {
  color: #40a9ff;
}

.retry-action-btn:disabled {
  color: #bfbfbf;
  cursor: not-allowed;
  text-decoration: none;
}
</style>
