import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'
import {routeNames} from "@/shared/config/routes.ts";
import router  from "@/app/router/router.ts"

export const useGlobalAppState = createGlobalState(() => {


  const sideBarState = ref<boolean>(true)

  function sideBarOut() {
    sideBarState.value = !sideBarState.value
  }

  function startNewChat() {
    router.push({ name: routeNames.homePage })
  }

  return { sideBarState, sideBarOut, startNewChat }
})