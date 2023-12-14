import { Children, createRef, provide, inject, Ref } from 'airx'

interface Transform {
  scale: number
  position: Position
}

export interface Context {
  nodes: Node[]
  transform: Transform
}

export interface NodePort {
  type: string
  name: string
}

export interface Position {
  x: number
  y: number
}

export interface Node {
  name: string
  input: NodePort[]
  output: NodePort[]
  position: Position
}

const contextSymbol = Symbol('BlueMapContext')

export function BlueMapContextProvider(props: { children: Children }) {
  const context = createRef<Context>({
    nodes: [],
    transform: {
      scale: 1,
      position: { x: 0, y: 0 }
    }
  })

  provide(contextSymbol, context)
  return () => props.children
}

export function useBlueMapContext() {
  return inject<Ref<Context>>(contextSymbol).value!
}
