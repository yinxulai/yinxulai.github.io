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

    if ((rect.value.top - window.scrollY) > windowSize.value.innerHeight) {
      visible.value = false
      return
    }

    visible.value = true
  }

  onMounted(() => {
    if (__VUEPRESS_SSR__) return null
    // TODO: 每掉用一次就添加一系列 Listener 有待优化
    window.addEventListener('load', updateVisible)
    window.addEventListener('scroll', updateVisible)
    window.addEventListener('scroll', updateVisible)
    window.addEventListener('resize', updateVisible)
  })

  onUnmounted(() => {
    if (__VUEPRESS_SSR__) return null
    window.removeEventListener('load', updateVisible)
    window.removeEventListener('scroll', updateVisible)
    window.removeEventListener('scroll', updateVisible)
    window.removeEventListener('resize', updateVisible)
  })

  watch(element, () => {
    updateRect()
    updateVisible()
  }, {
    flush: 'post',
    immediate: true
  })

  return visible
}
