<script lang="ts" setup>
</script>

<template>
  <div class="footer">
    <div class="left">
      <span class="copyright">
        Copyright © 2021-{{ new Date().getFullYear() }}
      </span>
      <span class="ipc">
        <a target="_black" href="https://beian.miit.gov.cn">皖ICP备19004644号-1</a>
      </span>
        <span class="power">
        Power by <a target="_black" href="//vuepress.vuejs.org">@vuepress</a>
      </span>
    </div>
    <div class="rignt">
      <a href="/">首页</a> ｜ 
      <a href="/about">关于</a> ｜
      <a target="_black" href="//github.com/yinxulai">Github</a>
    </div>
  </div>
</template>

<style lang="less" scoped>
.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  font-size: 12px;
  padding-top: 20px;
  line-height: 40px;
  padding-bottom: 20px;
  font-family: "Menlo", monospace;
  color: rgba(255, 255, 255, 0.5);
  
  .left {
    >* {
      margin-right: 0.5rem;
    }
  }
}
</style>
