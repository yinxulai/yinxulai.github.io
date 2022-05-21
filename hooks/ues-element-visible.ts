import { ref, Ref, watch } from 'vue'

export function uesElementVisible(elementRef: Ref<Element | undefined>) {
  const visibleRef = ref<boolean>(false)

  watch(elementRef, () => {
    if (elementRef.value == null) return

    const observer = new IntersectionObserver((entry) => {
      visibleRef.value = entry[0].isIntersecting
    }, { rootMargin: '0px', threshold: 0.5 })
    observer.observe(elementRef.value)
    return () => observer.disconnect()
  }, { flush: 'post', immediate: true }
  )

  return visibleRef
}
