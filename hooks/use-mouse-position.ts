import { Ref, ref, watchEffect } from 'vue'

type ElementRef = Ref<HTMLElement | undefined>

interface MousePosition {
  offsetX: number
  offsetY: number
}

export function useMousePosition(element: ElementRef): Ref<MousePosition> {
  const point = ref<MousePosition>({ offsetX: 0, offsetY: 0 })

  const updatePoint = (event: MouseEvent) => {
    const { offsetX, offsetY } = event
    point.value = { offsetX, offsetY }
  }

  watchEffect((onInvalidate) => {
    if (element.value == null) return
    element.value.addEventListener('mousemove', updatePoint)
    onInvalidate(() => {
      if (element.value == null) return
      element.value.removeEventListener('mousemove', updatePoint)
    })
  })

  return point
}
