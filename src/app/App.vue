<script setup lang="ts">
import './styles'
import MainAreaPages from "../pages/MainAreaPages.vue";
import SideBar from "../widgets/SideBar.vue";
</script>

<template>
  <div class="global-wrapper">
    <SideBar />
    <MainAreaPages />
  </div>
</template>

<style lang="css" scoped>
  .global-wrapper {
    display: grid;
    grid-template-columns: 296px 1fr;
    min-height: 100vh;
    padding: 10px 10px 10px 0;
  }
</style>
