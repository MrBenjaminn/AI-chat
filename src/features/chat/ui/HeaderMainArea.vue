<script setup lang="ts">
import { Button } from '@/shared'
import iconPlus from '@shared/assets/icons/Plus.svg?component'
import iconSideBarOut from '@shared/assets/icons/Side-Bar-Out.svg?component'
import { useGlobalAppState } from '@/shared/lib/state/useGlobalAppState.ts'
import { ButtonVariant, ButtonSize } from "@/shared/ui/button/model/button.ts";

const globalState = useGlobalAppState()
</script>

<template>
  <header class="header-chat">
    <h1 class="header-chat__title">Chats</h1>
    <Button
      label="SideBarOut"
      @click.prevent="globalState.sideBarOut()"
      :variant="ButtonVariant.Secondary"
      class="buttonSideBarOut"
    >
      <template #icon-left>
        <iconSideBarOut />
      </template>
    </Button>
    <Button
      :variant="ButtonVariant.Primary"
      @click="globalState.startNewChat()"
      :disabled="globalState.isLlmLoading.value"
      :size="ButtonSize.Small"
    >
      <template #icon-left>
        <iconPlus />
      </template>
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
  border-bottom: 1px solid #e3e6ea;
}

.header-chat__title {
  font-size: var(--big-font-size);
  font-weight: 500;
  color: var(--dark-color);
}

.buttonSideBarOut {
  margin-right: auto;
  margin-left: 10px;
}

@media (min-width: 760px) {
  .header-chat {
    padding-top: 10px;
  }
  .buttonSideBarOut {
    display: none;
  }
}
</style>
