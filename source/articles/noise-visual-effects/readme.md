---
lang: zh-CN
date: 2021-08-24
title: 利用（noise）自然噪波生成有趣的视觉效果
description: 利用（noise）自然噪波生成有趣的视觉效果
---

# 利用（noise）自然噪波生成有趣的视觉效果

本文只是讨论如何利用自然噪波生成一些有趣的视觉效果，针对各种不同的噪波生成算法不做细致的讨论。

本文所有的 自然噪波 实现均使用 `simplex-noise` 算法，这是一种专门对性能进行过优化的生成算法，可以比较快速的在浏览器上执行。

## 🌲自然噪波 是啥

自然噪波其实就是一种生成随机数的算法，可能大家会立即联想到 `Math.random`，大体上其实也差不太多，
唯一不一样的点在于：`Math.random` 是'一定程度上的'纯随机，每一个连续生成的数据之间没有任何的关系，生成出来的数据呈均匀分布，
而自然噪波的特点是生成的连续（连续的关系可以是任意维度的）随机数之间存在相互关系，整体数据分布呈正态分布。

自然噪波的连续随机的变化来自于对大自然的模拟，在生活中，存在着各式各样的噪波：木头纹理、山脉起伏等等。

比如地形，它有起伏很大的山脉，也有起伏稍小的山丘，也有细节非常多的石子等，这些不同程度的细节共同组成了一个自然的地形表面。
这些随机的成分并不是完全独立的，他们之间有一定的关联。采用微积分里面的说法，就是像素点之间变化是连续的，并没有发生跳变。

实际上，很多 3D 的游戏就是利用 `自然噪波` 来生成随机的地形，就像下面这样：

### 地形起伏

通过 `simplex-noise` 生成随机且连续的 `z` 轴数值。

```ts:inject
import { Noise3DPlaneTerrain } from './Noise3dPlaneTerrain'
```

<Noise3DPlaneTerrain />

```ts:inject
import { Noise3dBoxTerrain } from './Noise3dBoxTerrain'
// <Noise3dBoxTerrain />
```

### 角度变化

按照固定的间距来生成线段，并使用 `simplex-noise` 来生成随机连续的角度。

一定程度上，这就像一个流场，在这个基础上可以实现很多有趣的效果。

```ts:inject
import { NoiseAngleField } from './NoiseAngleField'
```

<NoiseAngleField />

### 随机线条

使用一个随机的点和随机的线条长度、随机的角度，再加上残影，我们还可以生成这种效果：

```ts:inject
// import { NoiseLineAfterimage } from './NoiseLineAfterimage'
// <NoiseLineAfterimage />
```

### 更多复杂的组合

```ts:inject
import { AppleScreenProtect } from './AppleScreenProtect'
```

<AppleScreenProtect />

### 总结

总结 `noise` 其实就是一种特殊模拟随机数的算法，它的特点主：

1. 可以生成任意纬度下随机且连续的数据
2. 对于相同的 `位置` 生成的数据一定是稳定的
