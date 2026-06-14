<script setup lang="ts">
import { Button } from '@/shared'
import { useLoginStore } from '@pages/login/model/useLoginStore.js'

const loginStore = useLoginStore()
</script>

<template>
  <div class="login-wrapper">
    <Button
      class="primary"
      @click="loginStore.startAuth()"
    >
      Login
    </Button>
  </div>
</template>

<style lang="css" scoped>
.login-wrapper {
  background-image: url('@/shared/assets/images/Background-Wrapper-Chat.svg');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.primary {
  width: 443px;
}

.primary:hover {
  transform: none;
  opacity: 0.9;
  cursor: pointer;
}
</style>
