---
lang: zh-CN
date: 2022-09-16
title: 通过 Web USB 给 Nintendo Switch 注入并执行引导程序 
description: 通过 Web USB 给 Nintendo Switch 注入并执行引导程序 
---
# 通过 Web USB 给 Nintendo Switch 注入并执行引导程序 

## 前言

首先，工具奉上~

```tsx:inject
import { NsSwitchCFWLoader } from './NsSwitchCFWLoader'
```

<NsSwitchCFWLoader />

其次，这里不讨论关于 Switch 破解的方法，仅讨论利用 WebUSB 进行漏洞利用的基本原理和实现。

### 注意

由于目前仅有 Chrome 实现了 WebUSB 规范，所以首先请确保你使用的应该是 Chrome 浏览器并且尽可能是新版，~~此外由于一些未知的原因，在 Windows 平台上系统无法正确的识别 Switch RCM 模式下的 USB 硬件，这导致该程序无法在 Windows 下使用，但我并不会在后面持续的跟踪这个问题，所以，即使界面上提示不支持，你依旧可以点击 “我想试试” 来尝试在 Windows 上进行注入，但大多数不会成功，祝你好运~~。

windows 下由于驱动问题默认情况下是无法发现设备的，如果碰到设备选项中没有你的 Nintendo Switch 设备，请安装驱动后重试。

整个程序仅仅是用于研究和学习，在使用过程中发生任何不可恢复的损失我们皆不负责，不过目前来说未发现任何问题。

### 发生了什么

简单来说 Nintendo Switch 所使用的 Tegra X1 SoC 存在一个漏洞，这个漏洞可以让我们在设备处于 RCM 模式时在启动阶段绕过所有的签名检查执行任意代码，所以，通过 Nintendo Switch 引导自定义系统主要分为两个阶段：

- 进入 RCM 模式
- 注入自定义的引导程序并执行（核心）

关于 RCM 模式如何进入不是我们的核心，我们主要讨论第二点。

### 如何通过 USB 注入并执行任意代码
