import { CSSProperties, Children, createRef, onMounted } from 'airx'
import { BlueMapContextProvider, useBlueMapContext } from './context'

import style from './style.module.less'

interface TransformSpaceProps {
  children: Children
}

function TransformSpace(props: TransformSpaceProps) {
  let isHoldSpaceBar = false
  const context = useBlueMapContext()
  const elementRef = createRef<HTMLDivElement | undefined>(undefined)

  const handleSpaceBar = (down: boolean, event: KeyboardEvent) => {
    event.preventDefault()
    isHoldSpaceBar = down && event.key === " "
  }

  const handleMouseMove = (event: MouseEvent) => {
    event.preventDefault()
    if (!isHoldSpaceBar) return
    if (event.buttons !== 1) return
    console.log(event, isHoldSpaceBar)
  }

  const handleMouseWheel = (event: WheelEvent) => {
    event.preventDefault()
    if (context.value == null) return
    const { position, scale } = context.value.transform
    const newScale = Math.min(Math.max(scale + Math.tanh(event.deltaY) * 0.05, 0.1), 2)

    context.value = {
      ...context.value,
      transform: {
        position,
        scale: newScale
      }
    }
  }

  onMounted(() => {
    window.addEventListener('wheel', handleMouseWheel)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keyup', e => handleSpaceBar(false, e))
    window.addEventListener('keydown', e => handleSpaceBar(true, e))
    return () => {
      window.removeEventListener('wheel', handleMouseWheel)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keyup', e => handleSpaceBar(false, e))
      window.removeEventListener('keydown', e => handleSpaceBar(true, e))
    }
  })

  return () => {
    const { position, scale } = context.value.transform
    const transformStyle: CSSProperties = {
      scale
    }

    console.log('22222', transformStyle)
    return (
      <div
        ref={elementRef}
        style={transformStyle}
        class={style.transformSpace}
      >
        {props.children}
      </div>
    )
  }
}

interface GlobalContextMenuProps {
  children: Children
}

function GlobalContextMenu(props: GlobalContextMenuProps) {
  return () => props.children
}

interface NodeProps {}

function Nodes(props: NodeProps) {
  const context = useBlueMapContext()
  return () => (<span>{JSON.stringify(context.value)}</span>)
}

export function BlueMap() {
  return () => (
    <BlueMapContextProvider>
      <div class={style.root}>
        <TransformSpace>
          <GlobalContextMenu>
            <Nodes />
          </GlobalContextMenu>
        </TransformSpace>
      </div>
    </BlueMapContextProvider>
  )
}
