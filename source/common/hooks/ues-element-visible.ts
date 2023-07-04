import { createRef, Ref, watch, onMounted } from 'airx'

export function uesElementVisible(element: Ref<Element | undefined>) {

  const visibleRef = createRef<boolean>(false)
  const observerRef = createRef<IntersectionObserver | null>(null)

  const createIntersectionObserver = () => {
    if (element.value == null) {
      return
    }

    if (observerRef.value != null) {
      observerRef.value.disconnect()
    }

    observerRef.value = new IntersectionObserver((entries) => {
      for (let index = 0; index < entries.length; index++) {
        const entity = entries[index]
        if (entity.intersectionRatio <= 0.5) {
          visibleRef.value = false
          return
        }

        visibleRef.value = true
      }
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] })
    observerRef.value.observe(element.value)
  }

  onMounted(() => {
    createIntersectionObserver()
    return () => {
      if (observerRef.value != null) {
        observerRef.value.disconnect()
      }
    }
  })

  watch(element, () => createIntersectionObserver())

  return visibleRef
}
