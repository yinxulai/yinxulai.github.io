import { RouteComponentProps } from 'airx-router'
import { Footbar } from '../Footbar'
import { Navbar } from '../Navbar'

import style from './style.module.less'

export function Layout(props: RouteComponentProps) {
  return () => (
    <div class={style.layout}>
      <div class="fixed inset-0 flex justify-center">
        <div class="flex w-full">
          <div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div class="relative flex w-full flex-col">
        <Navbar />
        <main class="flex-auto">
          {props.children}
        </main>
        <Footbar />
      </div>
    </div>
  )
}
