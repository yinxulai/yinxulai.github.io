<template>
  <input v-model="fontList" />
  <input type="file" @change="changeflie" accept="image/*" />
  <p>{{ result }}</p>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'

const result = ref<string>('')
const fontList = ref<string>('')

const fontGrayscaleMap = computed(() => {
  const map = new Map<number, string>()
  if (!fontList.value) return map

  return map
})

const imageGrayscaleTable = computed(() => {})
</script>
