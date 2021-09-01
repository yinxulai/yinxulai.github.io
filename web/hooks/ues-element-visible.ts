import { ref, Ref, watch, onMounted, onUnmounted } from 'vue'
import { useWindowsSize } from '@hooks/use-window-size'

export function uesElementVisible(element: Ref<Element | undefined>) {

  const windowSize = useWindowsSize()
  const visible = ref<boolean>(false)
  const rect = ref<DOMRect | null>(null)

  const updateRect = () => {
    if (element.value == null) {
      rect.value = null
      return
    }

    // 性能损耗大，推荐使用 IntersectionObserver
    rect.value = element.value.getBoundingClientRect()
  }

  const updateVisible = () => {
    if (rect.value == null) {
      visible.value = false
      return
    }

    if (rect.value.right < 0) {
      visible.value = false
      return
    }

    if (rect.value.bottom < 0) {
      visible.value = false
      return
    }

    if (rect.value.left > windowSize.value.clientWidth) {
      visible.value = false
      return
    }

    if (rect.value.top > windowSize.value.innerHeight) {
      visible.value = false
      return
    }

    visible.value = true
  }

  onMounted(() => {
    window.addEventListener('scroll', updateRect)
    window.addEventListener('load', updateVisible)
    window.addEventListener('scroll', updateVisible)
    window.addEventListener('resize', updateVisible)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateRect)
    window.removeEventListener('load', updateVisible)
    window.removeEventListener('scroll', updateVisible)
    window.removeEventListener('resize', updateVisible)
  })

  watch([element], () => {
    updateRect()
    updateVisible()
  }
  )

  return visible
}
