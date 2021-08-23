<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
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
.not-found {
  display: flex;
  flex-direction: column;

  justify-content: center;
  box-sizing: border-box;
  min-height: 100%;
  max-width: 50rem;
  padding: 0 1rem;
  margin: 0 auto;

  .content {
    flex: 1;
  }

  h1 {
    text-align: center;
    font-size: 20rem;
  }
}
</style>
