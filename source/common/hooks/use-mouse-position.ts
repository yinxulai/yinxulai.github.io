import { Ref, createRef, watch } from 'airx'

type ElementRef = Ref<HTMLElement | undefined>

interface MousePosition {
  offsetX: number
  offsetY: number
}

export function useMousePosition(element: ElementRef): Ref<MousePosition> {
  const point = createRef<MousePosition>({ offsetX: 0, offsetY: 0 })

  const updatePoint = (event: MouseEvent) => {
    const { offsetX, offsetY } = event
    point.value = { offsetX, offsetY }
  }

  watch(element, () => {
    if (element.value == null) return
    element.value.addEventListener('mousemove', updatePoint, { passive: true })
    return () => {
      if (element.value == null) return
      element.value.removeEventListener('mousemove', updatePoint)
    }
  })

  return point
}
