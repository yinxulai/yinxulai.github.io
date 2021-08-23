<template>
  <div class="page-list">
    <section class="item" v-bind:key="page.key" v-for="page in viewData.pageList">
      <span class="date">{{ page.date }}</span>
      <a class="title" v-bind:href="page.path">{{ page.title }}</a>
    </section>
  </div>
</template>
<style lang="less" scoped>
.item + .item {
  margin-top: 6px;
}
.date {
  font-size: 14px;
  margin-right: 1rem;
  color: rgba(255, 255, 255, 0.5);
}
</style>
<script lang="ts" setup>
import { watchEffect, reactive } from 'vue'
import { PageData, usePagesData } from '@vuepress/client'

interface Props {
  category?: string
  sort?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  category: undefined,
  sort: 'asc',
})

type ViewPageData =
  | PageData
  | {
      key: string
      notLoaded: true
    }

interface ViewData {
  pageList: ViewPageData[]
}

const viewData = reactive<ViewData>({
  pageList: [],
})

///////////////// 处理数据 ///////////////////

watchEffect(async () => {
  const pagesDataRef = usePagesData()
  const pagesData = pagesDataRef.value

  // 调用 get 获取
  const loadPagePromiseList = Object.values(pagesData).map((load) => load())

  viewData.pageList = (await Promise.all(loadPagePromiseList))
    .filter((page: any) => {
      // 过滤掉 WIP 的页面
      if (page.filePath != null && page.filePath !== '') {
        return page.filePath.indexOf('WIP') === -1
      }
      return true
    })
    .sort((f, l) => {
      // 处理排序
      const fDate = f.frontmatter.date ? new Date(f.frontmatter.date).valueOf() : 0
      const lDate = l.frontmatter.date ? new Date(l.frontmatter.date).valueOf() : 0
      return props.sort === 'asc' ? fDate - lDate : lDate - fDate
    })
    .filter((page) => {
      // 返回指定的 category
      if (props.category == null || props.category == '') return true
      return page.frontmatter.category === props.category
    })
})
</script>
