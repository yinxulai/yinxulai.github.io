<template>
  <input v-model.lazy="column" placeholder="请输入填充字符" />
  <input v-model.lazy="characterList" placeholder="请输入填充字符" />
  <input type="file" accept="image/*" @change="handleSelectFile" />
  <canvas ref="canvas"></canvas>
  <div class="row" v-for="(row, x) in imageGrayscaleTable" :key="x">
    <div :key="y" class="column" v-for="(gray, y) in row">{{ renderText(gray) }}</div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue'

const defaultCharacterList =
  '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

const column = ref<number>(10)
const characterList = ref<string>(defaultCharacterList)

const result = ref<string>()
const image = ref<HTMLImageElement>()
const canvas = ref<HTMLCanvasElement>()

const getGrayscale = (data: Uint8ClampedArray) => {
  const rgbaData = data.reduce(
    (previous, current, i) => {
      previous[i % 4] += current
      return previous
    },
    [0, 0, 0, 0]
  )

  const pixCount = data.length / 4
  const r = Math.floor((rgbaData[0] / pixCount) * 0.299)
  const g = Math.floor((rgbaData[1] / pixCount) * 0.587)
  const b = Math.floor((rgbaData[2] / pixCount) * 0.114)

  return r + g + b
}

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
  if (!characterList.value) return { map, keys: [] }
  if (canvas.value == null) return { map, keys: [] }

  // const context = getCanvas2DContext()
  const size = 50
  canvas.value.width = size
  canvas.value.height = size
  const characters = characterList.value
  const context = canvas.value.getContext('2d')!
  const characterSet = new Set(characters.split(''))
  for (const character of characterSet) {
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 0, size, size)

    context.fillStyle = '#000000'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = `Bold 50px Menlo`
    context.fillText(character, size / 2, size / 2)
    const imageData = context.getImageData(0, 0, size, size)
    const value = getGrayscale(imageData.data)
    // 个别字符的灰度信息相同，导致被替换
    map.set(value, character)
  }

  return { map, keys: Array.from(map.keys()).sort() }
})

const imageGrayscaleTable = computed(() => {
  const table: number[][] = []
  if (image.value == null) return table

  const { width, height } = image.value
  const context = getCanvas2DContext(width, height)
  const blockSize = Math.floor(width / column.value)
  context.drawImage(image.value, 0, 0, width, height)

  for (let x = 0; x < width; x += blockSize) {
    for (let y = 0; y < height; y += blockSize) {
      if (!Array.isArray(table[y / blockSize])) table[y / blockSize] = []
      const chuckData = context.getImageData(x, y, blockSize, blockSize)
      table[y / blockSize][x / blockSize] = getGrayscale(chuckData.data)
    }
  }

  return table
})

const renderText = (gray: number) => {
  let result: number | null = null
  const keys = fontGrayscaleMap.value.keys
  for (let index = 0; index < keys.length; index++) {
    const current = keys[index]
    if (result == null) {
      result = current
      continue
    }

    if (current - gray <= gray - result) {
      result = current
    }
  }
  
  return fontGrayscaleMap.value.map.get(result!) 
}
</script>
<style lang="less">
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.column {
  flex-shrink: 0;
  display: inline-block;
  width: 10px;
  height: 10px;
}
</style>
