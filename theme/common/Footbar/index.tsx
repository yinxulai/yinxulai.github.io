import { AirxElement } from 'airx'
import { useRouter } from 'airx-router'

import style from './style.module.less'

export function Footbar() {
  const router = useRouter()
  const nowYear = new Date().getFullYear()


  const handleClick = (e: MouseEvent, path: string) => {
    e.preventDefault()
    router.push(path)
  }

  const links = [
    (<a key="home" href="/" onClick={e => handleClick(e, '/')}>首页</a>),
    (<a key="about" href="/about" onClick={e => handleClick(e, '/about')}>关于</a>),
    (<a key="github" target="_black" href="//github.com/yinxulai">Github</a>)
  ]

  return () => (
    <div class={style.footer}>
      <div class={style.left}>
        <span>Copyright © 2021-{nowYear}</span>
        <span>
          <a target="_black" href="https://beian.miit.gov.cn">皖ICP备19004644号-1</a>
        </span>
        <span>
          Power by <a target="_black" href="https://github.com/airxjs/airx">💪Airx</a>
        </span>
      </div>
      <div class={style.right}>
        {links.reduce((acc, cur, index, array) => {
          acc.push(cur)
          if (index !== array.length - 1) {
            acc.push((<span> | </span>))
          }
          return acc
        }, new Array<AirxElement>())}
      </div>
    </div>
  )

}
