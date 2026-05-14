<script setup>
import Button from "../../shared/ui/Button/Button.vue";
import ButtonTelegram from "../../shared/assets/icons/Paper-Plane.svg?component"
</script>


<template>
  <div class="chat-wrapper">
    <div class="chat-container">
      <h2 class="chat-title">Welcome back, Mauro</h2>
      <p class="chat-text">Lorem ipsum dolor sit amet consectetur adipiscing elit sed</p>
      <div class="chat__input-wrapper">
        <label for="chat-input" class="visually-hidden">How can i help you?</label>
        <input
            type="text"
            class="input"
            id="chat-input"
            placeholder="How can i help you?"
        >
        <div class="chat__button-wrapper">
          <Button class="button-chat">
            <ButtonTelegram />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="css" scoped>
.chat-wrapper {
  padding: 40px 180px;
}

.chat-container {
  min-height: 234px;
  border-radius: var(--regular-radius);
  padding: var(--extra-large-padding) var(--large-padding);
  border: 1px solid #E3E6EA;
  background-color: var(--light-color);
  box-shadow: 0 2px 4px 0 rgba(25, 33, 61, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 10px;
  margin: auto;
  background-image: url("@/shared/assets/images/Background-Chat.svg");
  background-repeat: no-repeat;
  background-position: center bottom;
}

.chat-title {
  font-size: 22px;
  font-weight: 500;
}

.chat-text {
  font-weight: 400;
  line-height: 1.4;
  color: var(--neutral-color)
}

.chat__input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--regular-radius);
  background-color:  var(--light-color);
}

.input {
  min-height: 58px;
  width: clamp(142px,24.3vw,350px);
  background-color: transparent;
  border: none;
  padding: var(--small-padding) var(--default-padding);
  outline: none;
}

.chat__button-wrapper {
  padding: 8px;
  height: 58px;
  background-color: transparent;
}

</style>