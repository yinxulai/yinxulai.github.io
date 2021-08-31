import { Ref, ref, computed } from 'vue'
import { makeNoise3D } from 'fast-simplex-noise'

export function useColorPlane(canvas: Ref<HTMLCanvasElement | undefined>) {
  let zOffset = ref(0.01)
  const noise = makeNoise3D()

  const canvasContext = computed(() => {
    if (canvas.value == null) return null
    return canvas.value.getContext('2d')
  })

  const offscreenImageData = computed(() => {
    if (canvas.value == null) return null
    if (canvasContext.value == null) return null

    const { width, height } = canvas.value
    return canvasContext.value.createImageData(width, height)
  })

  const render = () => {
    if (canvas.value == null) return
    if (canvasContext.value == null) return
    if (offscreenImageData.value == null) return
    for (let x = 0; x < offscreenImageData.value.width; x++) {
      for (let y = 0; y < offscreenImageData.value.height; y++) {
        const dataOffset = (x + y * offscreenImageData.value.width) * 4

        const gray = Math.floor(noise(x / 300, y / 300, zOffset.value) * 70) + 150
        offscreenImageData.value.data[dataOffset] = gray
        offscreenImageData.value.data[dataOffset + 1] = gray
        offscreenImageData.value.data[dataOffset + 2] = gray
        offscreenImageData.value.data[dataOffset + 3] = 255
      }
    }

    zOffset.value += 0.02
    canvasContext.value.fillStyle = '#000000'
    canvasContext.value.fillRect(0, 0, canvas.value.width, canvas.value.height)
    canvasContext.value.putImageData(offscreenImageData.value, 0, 0)
  }

  return { render }
}
