<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
  },
})
</script>

<template>
  <button
    class="action-buttons__btn"
    :aria-label="label"
  >
    <slot name="icon"></slot>
  </button>
</template>

<style lang="css" scoped>
.action-buttons__btn {
  outline: none;
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 6px;
}

.action-buttons__btn:hover {
  padding: 6px;
  border-radius: 50%;
  background-color: var(--background-hover);
}
</style>
