<template>
  <button @click="onClick">开始播放历史记录</button>
</template>
<script lang="ts" setup>
import { controllerSymbol } from './controller-symbol'
const onClick = () => {
  const global = window as any
  if (global != null &&global[controllerSymbol] != null) {
    global[controllerSymbol].startPlayHistory()
  }
}
</script>
