---
title: JarvisMR开发计划预告
published: 2026-10-17T21:23:29
description: '这是我在开发JarvisMR的计划预告,也久违的更新一下博客，并不是再摸鱼（可以看我Github提交记录）'
image: '/images/JarvisMR1.webp'
tags: [Unity, MR, AI,TTS]

draft: false 
lang: 'zh_CN'
---
# 1.总体计划核心
总体是延续我个人在今年3月份打算做的一个小demo的“秽土转生”，加上了我自己一直以来对于“贾维斯”的喜爱元素等
![计划建立记录](/images/JarvisMR2.webp)
本demo预计的核心主要以下几点：
- 将Unity-Skills的技能集成到**运行中**的JarvisMR中，让AI操控运行中的Unity场景，进行MR的交互式操作。
- 将模型的拆解和训练的过程，集成到JarvisMR中，让人与AI共同在运行中进行模型的拆解和训练。
- 嵌入ASR、TTS等语音交互模块，让JarvisMR可以进行语音交互；变成“贾维斯”式的智能助手。

# 2.主要架构
- Unity6
- XR Interaction Toolkit3.x
- PICO Unity Integration SDK 3.4
- SecureMR
- JarvisMR-Skills（未来的Unity-Skills-Runtime）
- LLM function calling
- Gemini Live/Qwen Realtime 实时模型
- PICO Spatial Anchor

# 3.超早期Demo演示（部分功能）
<video controls playsinline preload="none" poster="/images/JarvisMR1.webp" src="https://coscandles.micostar.cc/jarvismr-demo1.mp4"></video>