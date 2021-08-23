<template>
  <button @click="onClick">清空绘制轨迹</button>
</template>
<script lang="ts" setup>
import { controllerSymbol } from './controller-symbol'
const onClick = () => {
  const global = window as any
  if (global != null &&global[controllerSymbol] != null) {
    global[controllerSymbol].clearHistory()
  }
}
</script>
