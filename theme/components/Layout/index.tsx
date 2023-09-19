import { RouteComponentProps } from 'airx-router'
import { Footbar } from '../Footbar'
import { Navbar } from '../Navbar'

import style from './style.module.less'

export function Layout(props: RouteComponentProps) {
  return () => (
    <div class={style.layout}>
      <Navbar />
      <div class={style.content}>
        {props.children}
      </div>
      <Footbar />
    </div>
  )
}
