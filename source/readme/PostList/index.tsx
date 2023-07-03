import { useRouter } from 'airx-router'
import { injectPosts } from '../../../theme/hooks/post'

export function PostList() {
  const router = useRouter()
  const posts = injectPosts()

  const handleClick = (e: MouseEvent, path: string) => {
    e.preventDefault()
    router.push('/' + path)
  }

  return () => (
    <div class="page-list">
      {(posts.value || []).map(post => {
        return (
          <section key={post.path} class="item">
            {/* <span class="date">{dayjs(page.frontmatter.date).format('YYYY-MM-DD')}</span> */}
            <a class="title" href={post.path} onClick={(e) => handleClick(e, post.path)}>{post.path}</a>
          </section>
        )
      })}
    </div>
  )
}
