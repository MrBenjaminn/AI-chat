<script setup lang="ts">
import type { ButtonProps } from '@/shared/ui/button/model/button.ts'
import { ButtonVariant, ButtonSize, ButtonType } from '@/shared/ui/button/model/button.ts'
import { computed } from 'vue'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: ButtonVariant.Primary,
  size: ButtonSize.Default,
  type: ButtonType.Button,
  onlyIcon: false,
  disabled: false,
})

const buttonClasses = computed(() => {
  return [
    'base-button',
    `base-button--${props.variant}`,
    `base-button--${props.size}`,
    {
      'base-button--only-icon': props.onlyIcon,
      'base-button--disabled': props.disabled,
    },
  ]
})
</script>

<template>
  <component
    :class="buttonClasses"
    :type="href ? undefined : type"
    :is="href ? 'a' : 'button'"
    :href="href"
    :disable="disabled"
    :aria-label="label"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </component>
</template>

<style lang="css" scoped>
.base-button {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  outline: none;
  column-gap: 4px;
}

.base-button--primary {
  background: linear-gradient(var(--primary-color), 95%, #2174fd, #213bfd);
  border: 1px solid #1d60cf;
  color: var(--light-color);
  font-size: var(--small-font-size);
  box-shadow: var(--main-box-shadow);
  border-radius: var(--border-radius);
}

.base-button--primary:hover {
  transform: scale(1.05);
}

.base-button--secondary {
  background-color: transparent;
  border: none;
  flex-shrink: 0;
  padding: 6px;
}

.base-button--secondary:hover {
  padding: 6px;
  border-radius: 50%;
  background-color: var(--background-hover);
}

.base-button--small {
  height: 32px;
  padding: var(--small-padding) var(--default-padding);
}

.base-button--default {
  height: 42px;
  padding: var(--regular-padding) var(--default-padding);
}

.base-button--only-icon {
  width: 42px;
  height: 42px;
  padding: 0;
}
</style>
