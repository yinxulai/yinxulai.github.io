import * as path from 'path-browserify'
import { Route, Router, createHashHistory } from 'airx-router'

import { Post, providePosts } from './hooks/post'
import { Layout } from './components/Layout'

import './global.less'

interface Props {
  posts: Post[]
}

export function ThemeApp(props: Props) {
  providePosts(props.posts)

  const route: Route = {
    path: '/',
    children: [],
    component: Layout,
  }

  for (let index = 0; index < props.posts.length; index++) {
    const post = props.posts[index]

    // 默认访问方式
    route.children!.push({
      path: post.path,
      component: post.component
    })

    // 针对 test/readme.mdx? 可以直接通过 test or test/ 访问
    const dirname = path.dirname(post.path)
    const filename = path.basename(post.path)
    if (['readme.md', 'readme.mdx'].includes(filename)) {
      const routePath = dirname === '.' ? '/' : dirname
      route.children!.push({
        path: routePath,
        component: post.component
      })

      // 添加默认的根路由
      if (routePath === 'readme') {
        route.children!.unshift({
          path: '/',
          component: post.component
        })
      }
    }

    // 不带后缀可以访问
    route.children!.push({
      path: post.path.replace(/\..+$/, ''),
      component: post.component
    })
  }

  const history = createHashHistory()
  return () => (<Router history={history} routes={[route]} />)
}
