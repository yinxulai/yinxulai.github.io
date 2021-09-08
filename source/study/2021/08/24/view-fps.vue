<template>
  <span>{{ fps }} fps/s</span>
</template>
<script lang="ts" setup>
import { useFPS } from '@hooks/use-fps'
const fps = useFPS()
</script>
