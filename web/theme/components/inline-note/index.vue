<template>
  <div class="note">
    <section v-for="page in viewData.pageList" :key="page.key" class="item">
      <span class="date">{{ page.date }}</span>
      <a class="title" :href="page.path">{{ page.title }}</a>
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
