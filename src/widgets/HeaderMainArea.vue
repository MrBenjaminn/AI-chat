<script setup>
import Button from "../shared/ui/Button/Button.vue";
import Plus from "@/shared/assets/icons/Plus.svg?component"

</script>

<template>
  <header class="header-chat">
    <h1 class="header-chat__title">Chats</h1>
    <Button class="button-header">
      <Plus />
      New Chat
    </Button>
  </header>
</template>

<style lang="css" scoped>

.header-chat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--default-padding) var(--medium-padding);
  background-color: var(--light-color);
  border-top-left-radius: var(--regular-radius);
  border-top-right-radius: var(--regular-radius);
  border-bottom: 1px solid #E3E6EA;
}

.header-chat__title {
  font-size: var(--big-font-size);
  font-weight: 500;
  color: var(--dark-color);
}

</style>