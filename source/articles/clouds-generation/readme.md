---
lang: zh-CN
draft: true
date: 2023-07-01
title: shader 尝试：云效果
description: shader 尝试：云效果
---

# 云朵生成

## 参考文档

- https://zhuanlan.zhihu.com/p/399704141
- https://zhuanlan.zhihu.com/p/248965902
- https://blog.csdn.net/ZJU_fish1996/article/details/89211634
- https://playground.babylonjs.com/#11GAIH#265
- https://playground.babylonjs.com/#ATDL99#128
- https://playground.babylonjs.com/#0LDDEZ#12
- https://playground.babylonjs.com/#VMSEL8#0

## 雾状云

```ts:inject
import { FogClouds } from './FogClouds'
```

<FogClouds />

## 体积云

```ts:inject
import { VolumeClouds } from './VolumeClouds'
```

<VolumeClouds />
