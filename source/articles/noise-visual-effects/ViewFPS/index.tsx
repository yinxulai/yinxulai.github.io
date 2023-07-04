import { useFPS } from '../../../common/hooks/use-fps'

export function ViewFPS() {
  const fpsRef = useFPS()
  return () => (<span>{fpsRef.value} fps/s</span>)
}
