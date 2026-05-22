<script setup lang="ts">
import PaperPlaneSmall from '@/shared/assets/icons/Paper-Plane-Small.svg'
import { Button } from '@/shared'
import { useChatActions } from './model/ChatActions.ts'

const chatActions = useChatActions()

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
      v-model="chatActions.llmAskText"
      @keydown.enter.exact.prevent="chatActions.sendAsk()"
    ></textarea>
    <hr />
    <Button
      class="ai-chat__send-message"
      @click.prevent="chatActions.sendAsk()"
      :disabled="chatActions.isLlmLoading || !chatActions.llmAskText"
    >
      <template #icon>
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
</style>
