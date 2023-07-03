<template>
  <button @click="onClick">
    <slot />
  </button>
</template>
<script lang="ts" setup>
import { controllerSymbol } from './controller-symbol'

const onClick = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = window as any
  if (global != null && global[controllerSymbol] != null) {
    global[controllerSymbol].clearCanvas(1)
  }
}
</script>
