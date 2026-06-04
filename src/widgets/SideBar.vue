<script setup lang="ts">
import iconSideBarOut from '@/shared/assets/icons/Side-Bar-Out.svg?component'
import iconSideBarSettings from '@/shared/assets/icons/Side-Bar-Settings.svg?component'
import iconPlus from '@/shared/assets/icons/Plus.svg?component'
import {useChatActions} from '@/features/chat/model/ChatActions.ts'
import {ButtonVariant} from "@/shared/ui/button/model/button.ts";
import {useGlobalAppState} from "@/shared/lib/state/useGlobalAppState.ts"

import {ChatHistory} from '@/entities'
import {AccountInfo} from '@/entities'
import {Button} from '@/shared'
import {useAuth} from '@/shared/stores/authStore.ts'

const { sideBarState, sideBarOut, startNewChat } = useGlobalAppState()


const data = useAuth()
const chatActions = useChatActions()
</script>

<template>
  <aside
    class="side-bar"
    :class="!sideBarState && 'side-bar-out'"
  >
    <div class="side-bar__header">
      <AccountInfo
        :userAvatar="data.currentUser.avatar"
        :userName="sideBarState ? data.currentUser.name : null"
        class="accountSideBar"
      />
      <div class="action-buttons">
        <Button
          :variant="ButtonVariant.Secondary"
          :size="null"
          label="SideBarOut"
          @click.prevent="sideBarOut()"
        >
          <template #icon-left>
            <iconSideBarOut />
          </template>
        </Button>
        <Button
          :variant="ButtonVariant.Secondary"
          label="Settings"
          :size="null"
        >
          <template #icon-left>
            <iconSideBarSettings />
          </template>
        </Button>
      </div>
    </div>
    <ChatHistory :class="!sideBarState && 'chat-history-fade'" />
    <Button
      @click.prevent="startNewChat()"
      :disabled="chatActions.isLlmLoading"
      class="button-side-bar"
    >
      <template #icon-left>
        <iconPlus />
      </template>
      {{ sideBarState ? 'Start new chat' : null }}
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
  transition: width 0.6s ease;
}

.side-bar__header {
  display: flex;
  align-items: center;
  column-gap: 45px;
  transition: flex-direction 0.6s ease,
  row-gap 0.6s ease;
}

.action-buttons {
  display: flex;
  column-gap: 6px;
  transition: flex-direction 0.6s ease,
  row-gap 0.6s ease;
}

.chat-history-fade {
  opacity: 1;
  visibility: visible;
  overflow: hidden;
  transition: opacity 0.2s ease,
  visibility 0.2s ease;
}

.button-side-bar {
  width: 248px;
  margin-top: auto;
  transition: width 0.6s ease;
  white-space: nowrap;
  overflow: hidden;
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
    transition: opacity 0.25s ease 0.35s,
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
