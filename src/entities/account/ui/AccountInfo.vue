<script setup lang="ts">
defineProps<{
  userAvatar?: string
  userName?: string | null
  size?: 'account--small' | 'account--default'
}>()
</script>

<template>
  <div
    class="account"
    :class="size"
  >
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

.account--small {
  column-gap: 8px;
}

.account--default {
  column-gap: 12px;
}

.account__avatar {
  border-radius: 200px;
}

.account__user-name {
  white-space: nowrap;
  overflow: hidden;
}
</style>
