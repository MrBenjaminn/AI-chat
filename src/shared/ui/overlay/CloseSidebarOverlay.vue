<script setup lang="ts">
import {useGlobalAppState} from '@/shared/lib/state/useGlobalAppState.ts'

const globalState = useGlobalAppState()

</script>

<template>
  <div
    v-if="globalState.sideBarState"
    class="sidebar-overlay"
    @click="globalState.sideBarState = false"
  ></div>
</template>

<style lang="css" scoped>
@media (max-width: 760px) {
  .sidebar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: var(--regular-radius);

    background-color: rgba(0, 0, 0, 0.35);

    backdrop-filter: blur(2px);

    -webkit-backdrop-filter: blur(8px);

    transition: all 0.3s ease;
    z-index: 10;
  }
}
</style>
