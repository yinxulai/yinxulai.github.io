import { createRef } from 'airx'
import style from './style.module.less'

export function Navbar() {
  const htmlRef = createRef<HTMLElement | null>(null)

  return () => (<div ref={htmlRef} class={style.navbar}></div>)
}
