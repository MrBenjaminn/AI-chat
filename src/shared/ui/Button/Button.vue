<script setup>

</script>



<template>
    <button
        class="button"
        :class="className"
    >
      <slot></slot>
    </button>
</template>



<style lang="css" scoped>
.button {
  background: linear-gradient(var(--primary-color), 95%, #2174FD, #213BFD);
  border-radius: var(--border-radius);
  border: 1px solid #1d60cf;
  color: var(--light-color);
  font-size: var(--small-font-size);
  padding: var(--small-padding) var(--default-padding);
  display: flex;
  align-items:  center;
  justify-content:  center;
  box-shadow: var(--main-box-shadow);
}

.button:hover {
  transform: scale(1.05);
}

.button-header {
  max-height: 32px;
  column-gap: 4px;
  font-weight: 400;
}

.button-side-bar{
  width: 248px;
  column-gap: 4px;
  margin-top: auto;
}

.button-chat {
  height: 42px;
  width: 42px;
  padding: 0;
}

.button-send-message {
  margin-left: auto;
  column-gap: 16px;
}
</style>