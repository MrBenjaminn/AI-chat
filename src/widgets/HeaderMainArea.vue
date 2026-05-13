<script setup>
import Button from "../shared/ui/Button/Button.vue";

</script>

<template>
  <div class="header-chat">
    <h1 class="header-chat__title">Chats</h1>
    <Button className="button-header">
      <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.10001 0.6V9.6M9.60001 5.1H0.600006"
            stroke="white" stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"/>
      </svg>
      New Chat
    </Button>
  </div>
</template>

<style lang="css" scoped>

.header-chat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--default-padding) var(--medium-padding);
  max-width: 1134px;
  background-color: var(--light-color);
  border-top-left-radius: var(--regular-radius);
  border-top-right-radius: var(--regular-radius);
  border-bottom: 1px solid #E3E6EA;
}

.header-chat__title {
  font-size: var(--big-font-size);
  font-weight: 500;
  color: #19213D;
}

</style>