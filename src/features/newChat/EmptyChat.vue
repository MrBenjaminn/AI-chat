<script setup lang="ts">
import ButtonTelegram from '@/shared/assets/icons/Paper-Plane.svg?component'
import Button from '@/shared/ui/button/Button.vue'
import { useRouter } from 'vue-router'
import { useChatActions } from '@/features/chat/model/ChatActions.ts'
import { routeNames } from '@/shared/config/routes.ts'
import { useChatStore } from '@/entities/chat/ChatStore.ts'

const router = useRouter()
const chatStore = useChatStore()
const chatActions = useChatActions()
function createNewChat() {
  chatActions.sendAsk()
  router.push({ name: routeNames.chat, params: { id: chatStore.chatActiveId } })
}
</script>

<template>
  <section class="chat-wrapper">
    <div class="chat-card">
      <h2 class="chat-card__title">Welcome back, Mauro</h2>
      <p class="chat-card__text">Lorem ipsum dolor sit amet consectetur adipiscing elit sed</p>
      <div class="chat-card__input-wrapper">
        <label
          for="chat-input"
          class="visually-hidden"
          >How can i help you?</label
        >
        <input
          type="text"
          class="input"
          id="chat-input"
          placeholder="How can i help you?"
          v-model="chatActions.llmAskText"
          @keydown.enter.prevent="createNewChat"
        />
        <div class="chat-card__button-wrapper">
          <Button
            @click.prevent="createNewChat"
            onlyIcon
          >
            <template #icon-left>
              <ButtonTelegram />
            </template>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped>
.chat-wrapper {
  padding: 40px clamp(80px, 12.5vw, 180px);
}

.chat-card {
  min-height: 234px;
  border-radius: var(--regular-radius);
  padding: var(--extra-large-padding) var(--large-padding);
  border: 1px solid #e3e6ea;
  background-color: var(--light-color);
  box-shadow: 0 2px 4px 0 rgba(25, 33, 61, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 10px;
  margin: auto;
  background-image: url('@/shared/assets/images/Background-Chat.svg');
  background-repeat: no-repeat;
  background-position: center bottom;
}

.chat-card__title {
  font-size: 22px;
  font-weight: 500;
}

.chat-card__text {
  font-weight: 400;
  line-height: 1.4;
  color: var(--neutral-color);
}

.chat-card__input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--regular-radius);
  background-color: var(--light-color);
}

.input {
  min-height: 58px;
  width: clamp(142px, 24.3vw, 350px);
  background-color: transparent;
  border: none;
  padding: var(--small-padding) var(--default-padding);
  outline: none;
}

.chat-card__button-wrapper {
  padding: 8px;
  height: 58px;
  background-color: transparent;
}

@media (max-width: 760px) {
  .chat-wrapper {
    padding: var(--extra-large-padding) 10px;
  }
  .chat-card__input-wrapper {
    width: 100%;
    justify-content: space-between;
  }
  .input {
    width: 100%;
  }
}
</style>
