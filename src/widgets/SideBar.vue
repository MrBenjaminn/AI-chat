<script setup>
import Button from "../shared/ui/Button/Button.vue";
import SideBarOut from "../shared/assets/icons/Side-Bar-Out.svg?component";
import SideBarSettings from "../shared/assets/icons/Side-Bar-Settings.svg?component"
import Plus from "../shared/assets/icons/Plus.svg?component"
</script>

<template>
  <aside class="side-bar-wrapper">
    <div class="side-bar__header">
      <div class="account-wrapper">
        <img
            src="../shared/assets/images/Avatar.png"
            alt=""
            class="avatar"
        >
        <p class="user-name">Mauro Sicard</p>
      </div>
      <div class="action-button-wrapper">
        <button
            class="action-button-side"
            aria-label="Settings"
        >
          <SideBarSettings />
        </button>
        <button
            class="action-button-side"
            aria-label="Logout"
        >
          <SideBarOut />
        </button>
      </div>
    </div>
    <div class="chat-list-wrapper">
      <h2 class="chat-title" id="history-label">Chat History</h2>
      <ul class="chat-list" aria-labelledby="history-label">
        <li class="chat-item">Quis ipsum suspendisse</li>
        <li class="chat-item">Quis ipsum suspendisse Quis</li>
      </ul>
    </div>
    <Button class="button-side-bar">
      <Plus />
      Start new chat
    </Button>
  </aside>
</template>

<style lang="css" scoped>
.side-bar-wrapper{
  width: 100%;
  height: 97.7vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  padding: var(--medium-padding) var(--medium-padding) var(--default-padding);
}

.side-bar__header{
  display: flex;
  align-items: center;
  column-gap: 45px;
}

.account-wrapper{
  display: flex;
  column-gap: 8px;
  align-items: center;
}

.action-button-wrapper {
  display: flex;
  flex-direction: row;
  column-gap: 12px;
}


.action-button-side {
  outline: none;
  background-color: transparent;
  border: none;
  display: flex;
  justify-content:  center;
  align-items: center;
  flex-shrink: 0;
}

.chat-list-wrapper{
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  margin-top: 40px;
}

.chat-title{
  font-size: var(--small-font-size);
  letter-spacing: 0.1em;
  color: #BAC0CC;
  font-weight: 300;
  text-transform: uppercase;
  padding-left: 12px;
}

.chat-item{
  color: var(--neutral-color);
  padding: var(--small-padding) 10px 12px;
}

.chat-item:hover {
  transform: scale(1.04);
  cursor: pointer;
  background-color: var(--background-hover);
  border-radius: var(--border-radius);
}

.action-button-side:hover {
  padding: 6px;
  border-radius: 50%;
  background-color: var(--background-hover);
}


</style>