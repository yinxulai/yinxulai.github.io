<template>
  <div class="layout">
    <navbar />
    <div class="content">
      <Content />
    </div>
    <footbar />
  </div>
</template>
<style lang="less">
@import "@vuepress/plugin-palette/style";
@import "@vuepress/plugin-palette/palette";

a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,.2);

  &:hover {
    color: @color-primary;
    border-bottom: 1px solid  @color-primary;
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
  max-width: 50rem;
  padding: 0 1rem;
  margin: 0 auto;

  .content {
    flex: 1;
  }
}
</style>
