<template>
  <button @click="onClick">
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
import { controllerSymbol } from './controller-symbol'
const onClick = () => {
  const global = window as any
  if (global != null && global[controllerSymbol] != null) {
    global[controllerSymbol].clearHistory()
  }
}
</script>
