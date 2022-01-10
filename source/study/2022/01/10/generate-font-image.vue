<template>
  <input v-model="fontList">
  <canvas id="canvas" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const fontList = ref<string>('')
const fontGrayscaleMap = ref<Map<string, number>>()
const imageGrayscaleTable = ref<Map<string, number>>()

// 计算字体灰度表
function computeFrontGrayscale() {}

// 计算图片灰度
function computeImageTable() {}




</script>
