---
lang: zh-CN
date: 2021-08-21
title: 本博客为什么选择 vuepress
description: 本博客为什么选择 vuepress
---

开始写博客的第一件事就是需要有一个博客，所以迎来了第一个问题：选择哪个框架？最终我觉定使用 `vuepress`, 总结起来原因有三点：

- 尝试 `vue@3`
- 支持 `Markdown`
- 允许在 `Markdown` 中直接插入 `JavaScript` 代码



### 为什么要尝试 `vue@3`？

`vue@3`(目前项目还叫`vue-next`)从第一个版本发出到现在已经快 2 年了，`vue@2` 是我开始接触前端时学习的第一个前端框架，
应该是在 2016 年左右，那时候我还是一名很菜的 UI 设计师，出于对开发的喜欢，利用上下班的通勤时间学习了前端的基础，
其实当时 `vue@2` 的名气并没有 `react` 大，不过在尝试性的学习了一周的 `react` 后，感觉学得不是很明白。
于是进而尝试了 `vue@2`，出色的中文文档以及极简的 `API` 让我很快就得到了想要的效果，于是它就成了我接下来两年主要使用的框架。

今天，我成为一名前端开发已有近 4 年的时间，其中有 3 年在使用 `react`，期间学习使用了 `TypeScript`，
从此 `react` + `TypeScript` 成了我的最爱。

直到 `vue@3` 的出现，尤其是了解到它是使用 `TypeScript` 开发的时候，我瞬间被吸引住了，并在第一时间阅读了 `reactive` 部分的源码，
但是却一直没有机会使用 `vue@3` 开发项目（这几年个人的产出确实有点低了，可能是有了女朋友的缘故吧）

直到我决定开始记录博客，在我寻找博客框架时，我第一时间考虑到了 `vuepress`，这个 `vue` 官方的文档工具，并且它已经在支持 `vue@3`(当前版本为 `vuepress@2.0.0-beta.24`)。

### 为什么要支持 `Markdown`？

实际上，在这几年，我出于学习的目的写了很多前后端分离的博客（尽管他们都没有完成），尝试了各种不同的前端、后端的框架，
在这个期间我确实收获颇多，实际上那时候的目的更多是在尝试各种不同的技术或方案、框架，而不是博客本身。

回过头来，我发现其实我并不需要一个多么复杂的博客：可以使用简单的 `Markdown` 来编写我的博客，仅此而已。

### 为什么要支持在 `Markdown` 中直接插入 `JavaScript` 代码

我是一个喜欢尝试新事物和学习的人，我希望以后在博客里可以尝试一些有趣的事情，
最好直接把实时的、可交互的演示直接插入博客内容中，而不是通过其他方式（图片、视频）。

就像这样：

<canvas-draw />

你还可以 <clear-canvas>清空画布</clear-canvas>、<start-play-history>回放历史轨迹</start-play-history>，<stop-play-history>停止回放历史轨迹</stop-play-history>，
或者<clear-history>清空历史轨迹</clear-history>，你也可以自己随意画点什么（或许可以试试在播放轨迹的同时画点什么）。

### 结论

实际上如果只是支持 `Markdown`，我的选择其实很多，在线的技术交流社区、例如 `掘金`，可能是更好的选择，毕竟成本更低，并且受益可能更高。
支持在 `Markdown` 中直接插入 `JavaScript` 代码的其实也不少，但是好用、熟悉的可能只有 `vuepress`、`docz`、`dumi` 这几个了，
综合第一点，我最终选择了使用 `vuepress`。
