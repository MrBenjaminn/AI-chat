<script setup>
import HeaderMainArea from "../widgets/HeaderMainArea.vue";
import EmptyChat from "../features/create-new-chat/EmptyChat.vue";
</script>


<template>
  <div class="main-area-wrapper">
    <HeaderMainArea />
    <EmptyChat />
  </div>
</template>


<style lang="css" scoped>
.main-area-wrapper {
  grid-column: 2;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px 0 rgba(25, 33, 61, 0.1);
  border-radius: var(--regular-radius);
  height: 880px;
  background-color: var(--light-color);
  background-image: url("/src/shared/assets/images/Background Wrapper Chat.svg");
  background-repeat: no-repeat;
  background-position: center bottom;
}
</style>