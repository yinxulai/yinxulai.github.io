---
lang: zh-CN
draft: true
title: 人为什么一定要学习
description: 人为什么一定要学习
---

# 前言

> 我之所以能成功，是因为我站在巨人的肩上。

这篇内容仅仅只是在我学习过程中对这句话的一个新的理解。

## 读遗传学算法之名人堂

昨天晚上在无聊的看一些利用遗传算法训练 `agent` 躲避障碍的一个项目，这个项目很简单，不同的地方在于这个项目有一个比较有意思的展现方式，当然，这些并不是这篇文章的重心，而重心来自于这个作者在优化项目时的一些思考：

> One issue I had is some top performing agents will accidentally die off, even if they are awesome, just from sheer bad luck, due to the (deliberate) crowded nature of the agents in the simulation. A top wall-dodger agent from the last generation, may start off in the side of a crowd, and accidentally get pushed into a plank by a few other agents at the very beginning of the simulation, and hence not being able to pass its good genes to future generations.
> I have thought about this problem for a while, and came up with the idea of incorporating a “hall of fame” section in the evolution algorithm, that will record the genes of agents that have achieved record scores from the very beginning of time.  I have also modified my evolution library to incorporate this “hall of fame” feature, to keep the top 10 all-time-champions.  For each simulation, the hall-of-famers are brought back to life to participate against the current generation.  In that sense, each generation of agents will also have to compete against the greatest agents of all time.  Imagine being able to train with the likes of Wayne Gretzkey, Doug Gilmour, and Tim Horton during every single season of Hockey!

简单点说就是作者在思考如何优化训练效果的时候想到了一个 `hall of fame` 的方式：将每一代中最好的那一个 `agent` 放入一个单独的列表，当然，这个列表有一个最大的长度：10，此后，将这个单独的列表中的所有 `agent` 加入到后续的每一代训练中，直到有更好的 `agent` 诞生，然后顶替掉列表中的落后的 `agent`。

听起来真的很残酷，每一代的 `agent` 们都需要和历代最强的 `agent` 去竞争，从而变得更强。

## 有感

就目前来说，我们的科学还没办法做到让人类的每一代最优秀的数学家都活到现在与大家在一个时代竞争。

也许我们可以考虑克隆，抛开现在关于克隆的一些其他问题来说，这种方法虽然看起来和上面实验中使用的方法非常的接近，但是实际上我认为本质却非常不同：`agent` 的所有行为都是由 `agent` 背后的 `基因` 直接决定的，但是我们人类却不一样，人相比于实验中的 `agent` 复杂度完全不同，我认为对于人而言，相同的物质肉体并不一定会产生相同的思想和行为，至少使用克隆的不会，因此，克隆人可能并不会和被克隆的人一样的伟大。

但我们还有其他办法：我们虽然没有办法一起活着讨论（至少他们或许没办法或活着），但我们可以在思想上进行沟通，通过他们留下来的 `书籍`：虽然他们的观点和思考已经被固化在物质的 `书籍` 中，但通过理解他们，可以让我们的不需要从 `零` 开始训练，这就在某个程度上达到了实验中的目的。

实际上人类文明完全靠基因一定是没办法传承的，基因决定了一些最基本的原则，而在这些原则之上，我们通过学习与传承不断的进化，才有了如今社会，人会死，但是思想却可以传承。
