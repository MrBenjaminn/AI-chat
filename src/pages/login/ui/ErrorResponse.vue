<script setup lang="ts">
</script>

<template>
  <div
    class="error"
  >
    Login session expired, please login again!
  </div>
</template>


<style lang="css" scoped>
.error {
  padding: 40px 10px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px 0 rgba(25, 33, 61, 0.1);
  width: 443px;
  text-align: center;
  color: var(--neutral-color);
}
</style>