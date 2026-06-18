<script setup lang="ts">
import { Button } from '@/shared'
import { useLoginStore } from '@shared/stores/useLoginStore.js'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { RouteNames } from '@/shared'
import { ErrorResponse } from "@/pages/login";

const loginStore = useLoginStore()
const urlParams = new URLSearchParams(window.location.search)
const checkCode = urlParams.has('code')
const router = useRouter()

const handleAuth = async () => {
  if (checkCode) {
    await loginStore.callBackCode()

    if (!loginStore.errorMessage) {
      await router.push({ name: RouteNames.homePage })
    }
  }
}

onMounted(() => {
  handleAuth()
})
</script>

<template>
  <div class="login-wrapper">
    <ErrorResponse v-if="loginStore.errorMessage" />
    <Button
      class="primary"
      @click="loginStore.startAuth()"
    >
      {{ !loginStore.errorMessage ? 'Login' : 'Login Again' }}
    </Button>
  </div>
</template>

<style lang="css" scoped>
.login-wrapper {
  background-image: url('@/shared/assets/images/Background-Wrapper-Chat.svg');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
  grid-column: 1/-1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
  background-color: var(--light-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px 0 rgba(25, 33, 61, 0.1);
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
