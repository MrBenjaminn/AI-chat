<script setup lang="ts">
import './styles'
</script>

<template>
  <div class="global-wrapper">
    <RouterView />
  </div>
</template>

<style lang="css" scoped>
.global-wrapper {
  position: relative;
  display: grid;
  grid-template-columns: 296px 1fr;
  max-height: 100dvh;
  width: 100%;
  padding: 10px 10px 10px 0;
  transition: grid-template-columns 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.global-wrapper:has(.side-bar-out) {
  grid-template-columns: 80px 1fr;
}

@media (max-width: 760px) {
  .global-wrapper {
    overflow: hidden;
    padding: 0;
    grid-template-columns: 296px 1fr;
  }

  .global-wrapper:has(.side-bar-out) {
    grid-template-columns: 0 1fr;
  }
}
</style>
