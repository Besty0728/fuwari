---
title: Win系统-Mac系统的使用感受+软件推荐
published: 2026-07-16T21:02:02
updated: 2026-07-17T14:22:02
description: '本文介绍从Win电脑上手Mac电脑的一些基础操作、软件推荐'
image: '/images/win-mac.webp'
tags: [Windows,Mac]

draft: false 
lang: ''
---
# 关于为何上手这款Mac
![终端快捷键设置图片](/images/win-mac4.webp)
1. 实习之后想的是Win台式+Mac移动开发
2. Mac的生态以及系统对于AI开发等具有更好地支持性
3. Mac Book Air真的很轻便，我真的不要那么重的Win游戏本了，太沉重、太吵闹
4. 最后一段时间在宿舍会有晚上断电，Win游戏本的续航在我没完成Vibe Coding时简直就是打断我“心流状态”的罪魁祸首，Mac的能耗比简直优美

# 我个人设备的区别
这台MacBookAir（M5，10C+10G，16G+1T）相比于我的暗影精灵（i9+4060，16+1T）性能虽总体较低，但是其他的优点完全碾压

1.轻，**mac仅仅1.23kg**，相较于那个omen的2.4kg很轻

2.移动使用下mac性能几乎无损，omen体验很差

# 迁移个人体验差别

## 操作逻辑

### 触控板
Mac的触控板很好用，其中多指操作主要会用以下几个
- 三指拖动文件
- 四指捏合出现应用面板
- 四指上滑类似于当前应用总览
- 四指下滑查看当前聚焦应用的窗口

### 快捷键

mac 上面的快捷键会更多地用于日常操作，熟练使用快捷键会让你的 Mac 舒适程度更上一层楼。**Mac 中 Command 键类比于 Win 中的 Ctrl 键，Option 类比 Alt 键，Control 反而默认较少，Shift 相同；下面只介绍部分常用。**

| 快捷键 | 功能 |
| :--- | :--- |
| Command + Q | 彻底退出应用 |
| Command + W | 关闭当前应用窗口 |
| Command + Option + W | 关闭当前应用的所有窗口 |
| Command + M | 最小化当前应用窗口 |
| Command + Option + M | 最小化当前应用的所有窗口 |
| Command + Control + F | 进入 / 退出全屏模式（Full Screen） |
| Command + Tab | 切换应用 |
| Command + , | 打开当前应用的设置 |

同样你也可以设定自己的快捷键位，以我个人为例：

| 快捷键 | 功能 / 说明 |
| :--- | :--- |
| Command + Shift + 3 | 全屏截图 |
| Command + Shift + 4 | 区域截图；加按 Space 可截取窗口 |
| Command + Shift + 5 | 截图工具栏，支持录屏、定时截图等 |
| Command + Shift + A | 截图到剪贴板（个人自定义快捷键） |
| Control + T | 在指定文件目录打开 iTerm2 终端 |
![终端快捷键设置图片](/images/win-mac3.webp)
![终端快捷键设置图片](/images/win-mac2.webp)

### 到手建议修改设置
- 触控板-点按力度改为弱、追踪速度建议倒数第二档即可、轻点以点按开启
- 访达开启显示隐藏内容（Command+Shift+.）
- 访达显示所有文件扩展名开启
- ![访达设置图片](/images/win-mac1.webp)
- 隐私与安全性底部，允许来源应用程序改为 App Store与已知开发者

### 安装&卸载应用
安装应用除了AppStore，还有pkg、dmg两种安装软件方式，根据其对应指引将软件图标拖入文件夹即可，卸载软件为拖入废纸篓即可（下文介绍更干净的卸载辅助）

# 软件等推荐

## 1.Homebrew包管理器
类似于linux中的apt，可以用于安装应用、依赖等等，非常实用

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

## 2.Loop窗口管理
可以提供非常方便的快速分屏应用，自定义后的Command+Control+小方向键非常直观的反映
::github{repo="mrkai77/Loop"}

## 3.Maccy粘贴板管理
让你可以更方便使用粘贴板，支持查看之前粘贴过的
::github{repo="p0deje/Maccy"}
::link{url="https://maccy.app"}
安装
```bash
brew install maccy
```

## 4.LocalSend局域网与Win电脑互传（迁移文件等）
个人使用其来完成win电脑与mac的互传，苹果设备间更建议直接隔空投送
::link{url="https://localsend.org/zh-CN"}
```bash
brew install --cask localsend
```

## 5.Mos鼠标防止反人类
默认手势的自然滑动很顺手，但是开启的同时接入鼠标非常反人类，开启反转无法保持触控板，这款软件可解决该问题
::github{repo="Caldis/Mos"}
::link{url="https://mos.caldis.me"}
安装
```bash
brew install --cask mos
```

## 6.iTerm2终端
个人使用这个纯粹是因为感觉自带默认终端不美观还不好配置暗黑模式
::github{repo="gnachman/iterm2"}
::link{url="https://iterm2.com"}

## 7.Stats状态显示
可以在右上角状态栏更直观的观察当前Mac状态负载
::github{repo="exelban/stats"}
::link{url="https://mac-stats.com"}
安装
```bash
brew install stats
```

## 8.AppCleaner卸载辅助
可以清理干净软件相关依赖，会自动在你将软件拖入废纸篓后启用
::link{url="https://freemacsoft.net/appcleaner"}