import { ref, onMounted, onUnmounted } from 'vue'

interface WindowSize {
  innerWidth: number
  innerHeight: number
  clientWidth: number
  clientHeight: number
}

export function useWindowsSize() {

  const size = ref<WindowSize>({
    innerWidth: 0,
    innerHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
  })

  const updateSize = () => {
    size.value = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight
    }
  }

  onMounted(() => {
    window.addEventListener('load', updateSize, { passive: true })
    window.addEventListener('resize', updateSize, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('load', updateSize)
    window.removeEventListener('resize', updateSize)
  })

  return size
}
