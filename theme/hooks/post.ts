import { AirxComponent, inject, provide, Ref } from 'airx'

export interface Post {
  path: string
  component: AirxComponent
}

export function providePosts(posts: Post[]) {
  provide('posts', posts)
}

export function injectPosts(): Ref<Post[] | null> {
  return inject('posts')
}
