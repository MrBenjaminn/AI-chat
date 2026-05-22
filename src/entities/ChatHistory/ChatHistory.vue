<script setup lang="ts">
import { useChatStore } from './model/chatStore'

const chats = useChatStore()

</script>

<template>
  <div class="side-bar__chat">
    <h2
      class="side-bar__chat-title"
      id="history-label"
    >
      Chat History
    </h2>
    <ul
      class="side-bar__chat-list"
      aria-labelledby="history-label"
    >
      <li
        class="side-bar__chat-item"
        v-for="item in chats.chatsList"
        :key="item.id"
      >
        <router-link
          class="side-bar__chat-text"
          :to="`/chat/${item.id}`"
        >
          {{ item.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="css" scoped>
.side-bar__chat {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  margin-top: 40px;
  transition:
    opacity 0.1s ease,
    visibility 0.1s ease;
  opacity: 1;
  overflow: hidden;
  z-index: 0;
  width: 100%;
}

.side-bar__chat-title {
  font-size: var(--small-font-size);
  letter-spacing: 0.1em;
  color: #bac0cc;
  font-weight: 300;
  text-transform: uppercase;
  padding-left: 12px;
}

.side-bar__chat-item:hover {
  background-color: var(--background-hover);
  border-radius: var(--regular-radius);
}

.side-bar__chat-text.router-link-active {
  background-color: #aaaaaa;
  border-radius: var(--regular-radius);
}

.side-bar__chat-text {
  text-decoration: none;
  color: var(--neutral-color);
  padding: var(--small-padding) 10px;
  width: 100%;
  display: block;
}
</style>
