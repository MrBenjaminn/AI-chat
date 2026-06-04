<script setup lang="ts">
import { Button } from '@/shared'
import { Buffer } from 'buffer'

async function createSHA256CodeChallenge(input: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Buffer.from(hash).toString('base64url')
}
</script>

<template>
  <div class="login-wrapper">
    <Button
      class="primary"
      href="https://openrouter.ai/auth?callback_url=<http://localhost:5173>&code_challenge=<CODE_CHALLENGE>&code_challenge_method=S256"
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
