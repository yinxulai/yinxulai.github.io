import { useRouter } from 'airx-router'
import { injectPosts } from '../../../theme/hooks/post'

import styles from './style.module.less'

export function PostList() {
  const router = useRouter()
  const posts = injectPosts()

  const handleClick = (e: MouseEvent, path: string) => {
    e.preventDefault()
    router.push('/' + path)
  }

  return () => {
    const viewed = (posts.value || []).slice()
    .sort((f, l) => {
      const fDate = f.meta.find(m => m?.key === 'date')?.value || '0000-00-00'
      const lDate = l.meta.find(m => m?.key === 'date')?.value || '0000-00-00'
      return new Date(fDate).valueOf() - new Date(lDate).valueOf()
    })
    .filter(post=> post.path.includes('articles/'))

    return (
      <div class={styles.pageList}>
        {viewed.map(post => {
          const date = post.meta.find(m => m?.key === 'date')
          const title = post.meta.find(m => m?.key === 'title')
          return (
            <section key={post.path} class={styles.item}>
              <span class={styles.date}>{date?.value || '--'}</span>
              <a class={styles.title} href={post.path} onClick={(e) => handleClick(e, post.path)}>
                {title?.value || post.path}
              </a>
            </section>
          )
        })}
      </div>
    )
  }
}
