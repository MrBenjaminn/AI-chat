<script setup>
const props = defineProps({
  userInfo: {
    type: Object,
  },
  sideBarState: {
    type: Boolean,
  },
})
</script>

<template>
  <div class="account">
    <img
      :src="userInfo.avatar"
      alt=""
      class="account__avatar"
    />
    <p class="account__user-name">{{ sideBarState ? userInfo.name : null }}</p>
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
