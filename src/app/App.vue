<script setup lang="ts">
import './styles'
import MainAreaPages from "../pages/MainAreaPages.vue";
</script>

<template>
  <div class="global-wrapper">
    <MainAreaPages />
  </div>
</template>

<style lang="css" scoped>
  .global-wrapper {
    display: grid;
    grid-template-columns: 21% 79%;
    margin: auto;
    max-width: 1440px;
  }
</style>
