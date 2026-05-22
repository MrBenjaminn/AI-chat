<script setup lang="ts">
import iconSideBarOut from '@/shared/assets/icons/Side-Bar-Out.svg?component'
import iconSideBarSettings from '@/shared/assets/icons/Side-Bar-Settings.svg?component'
import iconPlus from '@/shared/assets/icons/Plus.svg?component'

import { ChatHistory } from '@/entities'
import { AccountInfo } from '@/entities'
import { ButtonSideBar } from '@/shared'
import { Button } from '@/shared'
import { storeData } from '@/store'

const store = storeData()
</script>

<template>
  <aside
    class="side-bar"
    :class="!store.sideBarState && 'side-bar-out'"
  >
    <div class="side-bar__header">
      <AccountInfo
        :userInfo="store.currentUser"
        :sideBarState="store.sideBarState"
        class="accountSideBar"
      />
      <div class="action-buttons">
        <ButtonSideBar
          label="SideBarOut"
          @click.prevent="store.sideBarOut()"
        >
          <template #icon>
            <iconSideBarOut />
          </template>
        </ButtonSideBar>
        <ButtonSideBar label="Settings">
          <template #icon>
            <iconSideBarSettings />
          </template>
        </ButtonSideBar>
      </div>
    </div>
    <ChatHistory :class="!store.sideBarState && 'chat-history-fade'" />
    <Button
      class="button-side-bar"
      @click.prevent="store.startNewChat()"
      :disabled="store.isLlmLoading"
    >
      <template #icon>
        <iconPlus />
      </template>
      {{ store.sideBarState ? 'Start new chat' : null }}
    </Button>
  </aside>
</template>

<style lang="css" scoped>
.side-bar {
  width: 100%;
  height: 97.7vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  padding: var(--medium-padding) var(--medium-padding) var(--default-padding);
  transition: padding 0.6s ease;
}

.side-bar__header {
  display: flex;
  align-items: center;
  column-gap: 45px;
  transition:
    flex-direction 0.6s ease,
    row-gap 0.6s ease;
}

.action-buttons {
  display: flex;
  column-gap: 6px;
  transition:
    flex-direction 0.6s ease,
    row-gap 0.6s ease;
}

.chat-history-fade {
  opacity: 1;
  visibility: visible;
  overflow: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
}

.side-bar-out {
  width: 80px;

  & .side-bar__header {
    flex-direction: column;
    align-items: center;
    row-gap: 25px;
  }

  & .action-buttons {
    flex-direction: column;
    justify-content: center;
    row-gap: 6px;
  }

  & .button-side-bar {
    width: 42px;
    height: 42px;
  }

  & .chat-history-fade {
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.25s ease 0.35s,
      visibility 0.25s ease 0.35s;
    overflow: hidden;
    white-space: nowrap;
  }
}

@media (max-width: 760px) {
  .action-buttons {
    display: none;
  }
}
</style>
