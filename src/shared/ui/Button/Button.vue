<script setup>
const props = defineProps({
  className: {
    type: String,
  }
})
</script>



<template>
  <div>
    <button
        class="button"
        :class="className"
    >
      <slot></slot>
    </button>
  </div>
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

.button-header {
  max-height: 32px;
  column-gap: 4px;
  font-weight: 400;
}

.button-chat {
  height: 42px;
  width: 42px;
  padding: 0;
}
</style>