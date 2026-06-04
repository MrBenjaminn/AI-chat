<script setup lang="ts">
const props = defineProps<{
  userAvatar?: string
  userName?: string | null
}>()
</script>

<template>
  <div class="account">
    <img
      :src="userAvatar"
      alt=""
      class="account__avatar"
    />
    <p class="account__user-name">{{ userName }}</p>
  </div>
</template>

<style lang="css" scoped>
.account {
  display: flex;
  column-gap: 8px;
  align-items: center;
}

.account__avatar {
  border-radius: 200px;
}

.account__user-name {
  white-space: nowrap;
  overflow: hidden;
}
</style>
