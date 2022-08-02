<template>
  <div class="layout">
    <navbar />
    <h1 class="title">
      {{ $page.title }}
    </h1>
    <h4 v-show="$frontmatter.draft">
      目前这只是一个草稿，这意味着它有一些内容正在编写，但尚未做好准备。
    </h4>
    <div :class="['content', { 'draft': $frontmatter.draft }]">
      <div class="content-wrap">
        <Content />
      </div>
    </div>
    <footbar />
  </div>
</template>
<style lang="less">
@import '@vuepress/plugin-palette/style';
@import '@vuepress/plugin-palette/palette';

a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    color: @color-primary;
    border-bottom: 1px solid @color-primary;
  }
}

.header-anchor {
  color: @color-primary;
}
</style>
<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: column;

  box-sizing: border-box;
  min-height: 100%;
  padding: 0 1rem;
  margin: 0 auto;
  width: 50rem;

  .content {
    flex: 1;

    &.draft {
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px dashed rgba(255, 255, 255, 0.1);

      &::before {
        content: '-- 隐藏内容 --';
        min-height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      > .content-wrap {
        opacity: 0 !important;
      }
    }
  }
}
</style>
