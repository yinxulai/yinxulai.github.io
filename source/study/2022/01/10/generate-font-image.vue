<template>
  <input v-model="characterList" />
  <input type="file" accept="image/*" @change="handleSelectFile" />
  <canvas ref="canvas"></canvas>
  <div class="row" v-for="(row, x) in imageGrayscaleTable" :key="x">
    <div
      :key="y"
      class="column"
      v-for="(gray, y) in row"
      :style="{ background: `rgb(${gray},${gray},${gray})`}"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue'

const result = ref<string>()
const characterList = ref<string>()
const image = ref<HTMLImageElement>()
const canvas = ref<HTMLCanvasElement>()

const handleSelectFile = (event: InputEvent) => {
  const target = event.target as HTMLInputElement
  if (target == null || target.files == null) return
  const file = target.files[0]
  const imageObject = new Image()
  imageObject.src = URL.createObjectURL(file)
  imageObject.addEventListener('load', () => {
    URL.revokeObjectURL(imageObject.src)
    image.value = imageObject
  })
}

const getCanvas2DContext = (width = 10, height = 10) => {
  const canvas = document.createElement('canvas')
  canvas.height = height
  canvas.width = width

  return canvas.getContext('2d')!
}

const fontGrayscaleMap = computed(() => {
  const map = new Map<number, string>()
  if (!characterList.value) return map
  const context = getCanvas2DContext()
  const list = Array.from(new Set(characterList.value.split('')))
  for (const character of list) {
    context.textAlign = 'center'
    context.font = 'line-height: 10px'
    context.fillText(character, 0, 0)
  }

  return map
})

const imageGrayscaleTable = computed(() => {
  const table: number[][] = []
  if (image.value == null) return table
  if (canvas.value == null) return table

  const { width, height } = image.value

  canvas.value.width = width
  canvas.value.height = height
  const context = canvas.value?.getContext('2d')!
  context.drawImage(image.value, 0, 0, width, height)

  for (let x = 0; x < width; x += 10) {
    for (let y = 0; y < height; y += 10) {
      if (!Array.isArray(table[x / 10])) table[x / 10] = []
      const chuckData = context.getImageData(x, y, x + 10, y + 10).data

      const rgbaData = chuckData.reduce(
        (previous, current, i) => {
          previous[i % 4] += current
          return previous
        },
        [0, 0, 0, 0]
      )

      const pixCount = chuckData.length / 4
      const r = Math.floor((rgbaData[0] / pixCount) * 0.299)
      const g = Math.floor((rgbaData[1] / pixCount) * 0.587)
      const b = Math.floor((rgbaData[2] / pixCount) * 0.114)
      table[x / 10][y / 10] = r + g + b
    }
  }

  console.log('table:', table)
  return table
})

watch([characterList, imageGrayscaleTable], () => {
  console.log(characterList, fontGrayscaleMap, imageGrayscaleTable)
})
</script>
<style lang="less">
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.column {
  display: inline-block;
  width: 10px;
  height: 10px;
}
</style>
