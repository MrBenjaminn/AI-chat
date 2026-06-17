<script setup lang="ts">
import PaperPlaneSmall from '@/shared/assets/icons/Paper-Plane-Small.svg'
import { Button } from '@/shared'
import { useChatActions } from '@/features/chat/model/useChatActions.ts'
import { ButtonSize, ButtonType } from '@/shared/ui/button/model/button.ts'
import { useGlobalAppState } from '@/shared/lib/state/useGlobalAppState.ts'
import { computed } from 'vue'

const chatActions = useChatActions()
const globalState = useGlobalAppState()


const isSubmitDisabled = computed(() => {
  return Boolean(globalState.isLlmLoading || !chatActions.llmAskText.value.trim())
})
</script>

<template>
  <div class="ai-chat__input-send">
    <label
      for="input-message"
      class="visually-hidden"
    ></label>
    <textarea
      name="message-input-field"
      id="input-message"
      cols="30"
      rows="10"
      class="input ai-chat__input-message"
      placeholder="How can I help you?"
      v-model="chatActions.llmAskText.value"
      @keydown.enter.exact.prevent="chatActions.sendMessage"
    ></textarea>
    <hr />
    <Button
      class="ai-chat__send-message"
      @click.prevent="chatActions.sendMessage"
      :disabled="isSubmitDisabled"
      :type="ButtonType.Submit"
      :size="ButtonSize.Small"
    >
      <template #icon-left>
        <PaperPlaneSmall />
      </template>
      Send message
    </Button>
  </div>
</template>

<style lang="css" scoped>
.ai-chat__input-send {
  margin-top: auto;
  width: 100%;
  max-width: 900px;
  padding: var(--medium-padding) var(--medium-padding) var(--default-padding);
  border: 1px solid var(--border-color);
  border-radius: var(--regular-radius);
  background-color: var(--light-color);
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  box-shadow: 0 2px 4px 0 rgba(25, 33, 61, 0.08);
}

.ai-chat__input-message {
  resize: none;
  border: none;
  flex-grow: 1;
  max-height: 68px;
  outline: none;
}

hr {
  width: 100%;
  background-color: var(--border-color);
  border: none;
  margin: 0;
  height: 1px;
}

.ai-chat__send-message {
  margin-left: auto;
}
</style>
