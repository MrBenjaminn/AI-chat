<script setup>
import Button from "@/shared/ui/Button/Button.vue";
import PaperPlaneSmall from "@/shared/assets/icons/Paper-Plane-Small.svg?component"
</script>

<template>
  <div class="ai-chat-wrapper">
    <span class="date-chat">Today 2:45 PM</span>
    <div class="chat-wrapper">
      <img
          src="../shared/assets/images/Avatar.png"
          alt=""
          class="avatar"
      >
      <div class="chat-message-wrapper">
        <div class="sender-info-wrapper">
          <p class="sender-name">Mauro Sicard</p>
          <span class="sender-date">2:45 PM</span>
        </div>
        <p class="text-message">
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua ut enim ad minim
          veniam
        </p>
      </div>
    </div>
    <div class="input-field-wrapper">
      <label
          for="input-message"
          class="visually-hidden"
      ></label>
      <textarea
          name="message-input-field"
          id="input-message"
          cols="30"
          rows="10"
          class="input-field-message"
          placeholder="How can I help you?"
      ></textarea>
      <hr/>
      <Button class="button-send-message">
        <PaperPlaneSmall />
        Send message
      </Button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.ai-chat-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 40px;
  align-items: center;
  padding: 40px 280px;
  flex-grow: 1;
  background-color: var(--light-color);
  border-radius: var(--regular-radius);
}

.date-chat {
  font-size: var(--small-font-size);
  color: var(--neutral-color);
  font-weight: 400;
  display: flex;
  align-items: center;
  text-align: center;
  column-gap: 16px;
  width: 100%;
}

.date-chat:before,
.date-chat:after {
  content:'';
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.chat-wrapper {
  display: flex;
  column-gap: 12px;
  align-items: start;
}

.chat-message-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
}

.sender-info-wrapper {
  display: flex;
  column-gap: 12px;
  align-items: center;
}

.sender-name {
  color: var(--dark-color)
}

.sender-date {
  font-size: var(--small-font-size);
  color: var(--neutral-color);
}

.text-message {
  color: var(--neutral-color);
  font-weight: 400;
  line-height: 1.5;
}

.input-field-wrapper {
  margin-top: auto;
  width: 100%;
  padding: var(--medium-padding) var(--medium-padding) var(--default-padding);
  border: 1px solid var(--border-color);
  border-radius: var(--regular-radius);
  background-color: var(--light-color);
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  box-shadow: 0 2px 4px 0 rgba(25, 33, 61, 0.08);
}

.input-field-message {
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