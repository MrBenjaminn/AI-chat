<script setup>
import Button from "../../shared/ui/Button/Button.vue";
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
          <Button className="button-chat">
            <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5274 0.437465C17.1287 0.0387716 16.548 -0.0991485
              16.0149 0.0723823L1.03724 4.88684C0.468172 5.06996 0.074115 5.5521
              0.00921138 6.14666C-0.0556922 6.74007 0.225943 7.29638 0.741695
              7.59656L6.04524 10.6899L10.6267 6.10726C10.9663 5.76767 11.5168
              5.76767 11.8564 6.10726C12.196 6.44684 12.196 6.99736 11.8564
              7.33695L7.27378 11.9196L10.3671 17.2231C10.6395 17.6891 11.1205
              17.9637 11.6501 17.9637C11.7058 17.9637 11.7626 17.9603 11.8193
              17.9545C12.4127 17.8896 12.896 17.4955 13.078 16.9276L17.8936
              1.95111C18.0652 1.4145 17.9249 0.834999 17.5274 0.437465Z" fill="white"/>
            </svg>
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
  background-image: url("/src/shared/assets/images/Background Chat.svg");
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
}

.input {
  min-height: 58px;
  width: clamp(142px,24.3vw,350px);
  border-top-left-radius: var(--regular-radius);
  border-bottom-left-radius: var(--regular-radius);
  border: 1px solid var(--border-color);
  border-right: none;
  padding: var(--small-padding) var(--default-padding);
  outline: none;
}

.chat__button-wrapper {
  padding: 8px;
  height: 58px;
  border-top-right-radius: var(--regular-radius);
  border-bottom-right-radius: var(--regular-radius);
  border: 1px solid var(--border-color);
  border-left: none;
  background-color: var(--light-color);
}

</style>