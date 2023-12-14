import { Component, inject, provide, Ref } from 'airx'

interface MdMeta {
  key: string
  value: string
}

export interface Post {
  path: string
  meta: MdMeta[]
  component: Component
}

export function providePosts(posts: Post[]) {
  provide('posts', posts)
}

export function injectPosts(): Ref<Post[] | null> {
  return inject('posts')
}
