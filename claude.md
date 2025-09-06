# Fuwari 项目架构文档

> 📅 最后更新：2025年9月6日
> 
> 本文档用于帮助 AI 智能体快速理解 fuwari 项目的架构、功能和实现细节。

## 🎯 项目概述

**Fuwari** 是一个基于 Astro 框架构建的现代静态博客模板，具有以下核心特征：

- **框架**: Astro 5.7.9 + TypeScript
- **样式**: Tailwind CSS + 自定义 CSS 变量
- **组件**: Svelte 组件集成
- **部署**: 支持 Vercel、Netlify、GitHub Pages
- **性能**: 静态生成，SEO 优化

## 🏗️ 项目结构

```
fuwari/
├── src/
│   ├── config.ts                 # 全局配置文件
│   ├── components/               # UI 组件
│   │   ├── PostCard.astro       # 文章卡片
│   │   ├── Search.svelte        # 搜索组件
│   │   ├── Navbar.astro         # 导航栏
│   │   └── ...
│   ├── content/                 # 内容管理
│   │   ├── config.ts            # 内容集合配置
│   │   ├── posts/               # 博客文章 (Markdown)
│   │   └── spec/                # 规范文档
│   ├── layouts/                 # 页面布局
│   │   └── Layout.astro         # 主布局文件
│   ├── pages/                   # 页面路由
│   │   ├── [...page].astro      # 首页分页
│   │   ├── about.astro          # 关于页面
│   │   ├── apps.astro           # 应用展示
│   │   └── archive/             # 归档页面
│   ├── plugins/                 # 自定义插件
│   │   ├── rehype-image-fallback.mjs  # 图片回退
│   │   ├── remark-reading-time.mjs    # 阅读时间
│   │   └── ...
│   ├── styles/                  # 样式文件
│   ├── types/                   # TypeScript 类型定义
│   └── utils/                   # 工具函数
├── astro.config.mjs             # Astro 配置
├── package.json                 # 依赖管理
├── tailwind.config.cjs          # Tailwind 配置
└── ...
```

## ⚙️ 核心配置系统

### 1. 主配置文件 (`src/config.ts`)

包含以下配置模块：

```typescript
// 站点基础配置
export const siteConfig: SiteConfig = {
  title: "Betsy Blog",
  description: "分享网络技术、服务器部署、Unity开发、AI技术应用与原理",
  lang: "zh_CN",
  themeColor: { hue: 361, fixed: true, forceDarkMode: true },
  banner: { enable: false, src: "/xinghui.avif" },
  background: { enable: true, src: "https://image.ai0728.com.cn/random" },
  toc: { enable: true, depth: 2 },
  apps: [...] // 应用展示配置
};

// 导航配置
export const navBarConfig: NavBarConfig = {
  links: [LinkPreset.Home, LinkPreset.Archive, LinkPreset.About, ...]
};

// 个人资料配置
export const profileConfig: ProfileConfig = {
  avatar: "头像URL",
  name: "流转星(Betsy)",
  bio: "爱我所爱，我们是彼此永远的动力",
  links: [...]
};
```

### 2. 内容集合配置 (`src/content/config.ts`)

定义了内容类型的 Schema：

```typescript
const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    draft: z.boolean().optional().default(false),
    description: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    pinned: z.boolean().optional().default(false), // 置顶功能
    // 内部使用的前后文章链接
    prevTitle: z.string().default(""),
    prevSlug: z.string().default(""),
    nextTitle: z.string().default(""),
    nextSlug: z.string().default(""),
  }),
});
```

## 🎨 主题系统

### 1. 颜色主题
- 支持深色/浅色模式自动切换
- 基于 HSL 色调的自定义主题色
- CSS 变量系统实现动态主题切换

### 2. 背景系统
```typescript
background: {
  enable: true,
  src: "图片URL",
  position: "center",
  size: "cover",
  repeat: "no-repeat",
  attachment: "fixed",
  opacity: 0.5
}
```

### 3. 横幅配置
```typescript
banner: {
  enable: false,
  src: "/banner.jpg",
  position: "center",
  credit: { enable: true, text: "作者信息", url: "原作链接" }
}
```

## 📝 内容管理系统

### 1. 文章前置元数据格式
```yaml
---
title: 文章标题
published: 2025-08-12T08:35:00.000Z
updated: 2025-08-19T23:19:03.000Z
description: 文章描述
image: '/uploads/images/cover.png'
tags: [标签1, 标签2]
lang: ""  # 可选，覆盖站点默认语言
pinned: false  # 是否置顶
draft: false   # 是否为草稿
---
```

### 2. 文章排序逻辑 (`src/utils/content-utils.ts`)
```typescript
// 排序优先级：
// 1. 置顶文章优先
// 2. 按发布时间降序（精确到秒）
const sorted = allBlogPosts.sort((a, b) => {
  if (a.data.pinned !== b.data.pinned) {
    return a.data.pinned ? -1 : 1;
  }
  const dateA = new Date(a.data.published);
  const dateB = new Date(b.data.published);
  return dateA > dateB ? -1 : 1;
});
```

## 🔧 功能特性

### 1. 图片回退机制
```javascript
// 自动在图片加载失败时切换到备用图床
export const imageFallbackConfig = {
  enable: true,
  originalDomain: "image.ai0728.com.cn",
  fallbackDomain: "image.cloudrunmax.top"
};
```

### 2. Markdown 增强功能
- **数学公式**: KaTeX 支持
- **代码高亮**: Expressive Code + 语法高亮
- **指令支持**: remark-directive (:::note、:::warning 等)
- **自动链接**: 标题自动生成锚点
- **外链处理**: 自动添加 target="_blank"

### 3. 搜索功能
- Svelte 组件实现的客户端搜索
- 支持标题、描述、标签搜索
- 实时搜索结果展示

### 4. 音乐播放器 🎵
```typescript
// 集成在导航栏的音乐播放器组件 (MusicPlayer.svelte)
// 位置：统计按钮和搜索框之间
// 尺寸：40px × 40px (桌面) / 36px × 36px (移动端)

// 音频文件配置
const audioSources = [
  '/music/background.flac',  // 首选：FLAC 高质量无损格式
  '/music/background.mp3'    // 备选：MP3 标准压缩格式
];

// 核心特性：
// - 支持 FLAC/MP3 双格式自动回退
// - 纯静态实现，基于 HTML5 Audio API
// - 保持原始设计的动画效果 (borderAnimate + reveal)
// - 适配网站主题色彩 (var(--primary))
// - 错误处理和优雅降级
```

**播放器设计特点**：
- **交互方式**: 基于 `input[type="checkbox"]` 的原生CSS交互
- **动画效果**: 
  - `borderAnimate`: 播放时圆环旋转动画 (700ms)
  - `reveal`: 暂停图标显示动画 (300ms延迟)
  - `clip-path`: 播放图标形状变化
- **响应式**: 自动适配桌面和移动端尺寸
- **文件存储**: `/public/music/` 目录，支持多格式回退

### 5. 页面过渡动画
```typescript
// 使用 Swup 实现页面切换动画
swup({
  theme: false,
  animationClass: "transition-swup-",
  containers: ["main", "#toc"],
  smoothScrolling: true,
  cache: true,
  preload: true
})
```

## 📊 集成服务

### 1. 网站统计 (Umami)
```typescript
export const umamiConfig: UmamiConfig = {
  enable: true,
  baseUrl: "https://us.umami.is",
  shareId: "统计ID",
  timezone: "Asia/Shanghai"
};
```

### 2. RSS 订阅
- 自动生成 `/rss.xml`
- 包含最新文章摘要

### 3. SEO 优化
- 自动生成 sitemap
- Open Graph 标签
- 结构化数据支持

## 🚀 开发与部署

### 开发命令
```bash
pnpm dev          # 开发服务器
pnpm build        # 构建生产版本
pnpm preview      # 预览构建结果
pnpm new-post     # 创建新文章
pnpm format       # 代码格式化
pnpm lint         # 代码检查
```

### 部署配置
- **Vercel**: 零配置部署
- **Netlify**: 支持表单处理
- **GitHub Pages**: 静态托管
- **Docker**: 容器化部署支持

## 🎯 关键文件说明

| 文件/目录 | 作用 | 重要性 |
|-----------|------|--------|
| `src/config.ts` | 全局配置中心 | ⭐⭐⭐⭐⭐ |
| `src/content/posts/` | 博客文章存储 | ⭐⭐⭐⭐⭐ |
| `src/layouts/Layout.astro` | 页面主布局 | ⭐⭐⭐⭐ |
| `src/components/PostCard.astro` | 文章卡片组件 | ⭐⭐⭐⭐ |
| `src/components/MusicPlayer.svelte` | 音乐播放器组件 | ⭐⭐⭐ |
| `src/pages/[...page].astro` | 首页分页逻辑 | ⭐⭐⭐⭐ |
| `public/music/` | 音频文件存储目录 | ⭐⭐⭐ |
| `astro.config.mjs` | Astro 框架配置 | ⭐⭐⭐ |
| `src/plugins/` | 自定义插件目录 | ⭐⭐⭐ |

## 🔍 常见任务指南

### 添加新页面
1. 在 `src/pages/` 创建 `.astro` 文件
2. 使用 `MainGridLayout` 布局
3. 在 `navBarConfig` 中添加导航链接

### 自定义主题
1. 修改 `src/config.ts` 中的 `themeColor.hue`
2. 调整 `tailwind.config.cjs` 中的自定义颜色
3. 修改 `src/styles/` 中的 CSS 变量

### 添加新功能插件
1. 在 `src/plugins/` 创建插件文件
2. 在 `astro.config.mjs` 中注册插件
3. 更新相关类型定义

### 配置图片处理
1. 修改 `imageFallbackConfig` 设置图床回退
2. 在 Sharp 配置中调整图片优化参数
3. 配置 CDN 或图床服务

### 添加/配置音乐播放器
1. **添加音频文件**:
   ```
   public/music/
   ├── background.flac  (推荐，高质量)
   └── background.mp3   (备选，兼容性好)
   ```

2. **自定义音频源**:
   ```typescript
   // 在 MusicPlayer.svelte 中修改
   const audioSources = [
     '/music/your-song.flac',
     '/music/your-song.mp3'
   ];
   ```

3. **调整播放器样式**:
   - 修改 `.container` 的 `width` 和 `height` 调整大小
   - 通过 CSS 变量 `var(--primary)` 自动适配主题色
   - 响应式断点在 `@media (max-width: 768px)`

4. **播放器集成位置**: 
   - 文件：`src/components/Navbar.astro`
   - 位置：统计按钮和搜索框之间
   - 通过 `gap-2` 控制与其他元素的间距

## 📚 扩展建议

该项目具有良好的扩展性，可以考虑添加：
- 评论系统集成 (Giscus/Disqus)
- 全文搜索 (Algolia/Pagefind)
- 多语言 i18n 完整支持
- PWA 功能
- 图片画廊/灯箱效果
- 文章系列/专题功能
- 社交分享组件
- **音乐播放器增强**: 播放列表、音量控制、进度条等

## 🎵 音乐播放器技术细节

### 实现原理
```typescript
// 基于 HTML5 Audio API 的纯静态实现
// 支持现代浏览器的 FLAC 和 MP3 格式
// 通过 Svelte 组件集成到 Astro 导航栏

// 核心交互逻辑 (保持原始设计)
<input class="play-btn" type="checkbox">  // CSS 状态控制
<div class="play-icon"></div>             // 播放图标
<div class="pause-icon"></div>            // 暂停图标

// CSS 选择器链
.play-btn:checked + .play-icon            // 播放时隐藏播放图标
.play-btn:checked ~ .pause-icon::before   // 显示暂停图标左侧
.play-btn:checked ~ .pause-icon::after    // 显示暂停图标右侧
```

### 动画时序
```css
播放按钮点击 → checkbox:checked → borderAnimate (700ms)
                                ↓
                              reveal 动画:
                              - ::before (350ms 延迟)
                              - ::after (600ms 延迟)
```

### 错误处理
- 音频文件加载失败时自动回退到下一格式
- 播放失败时重置按钮状态
- 音频结束时自动重置到初始状态
- 未加载完成时禁用交互

---

**注意事项**：
- 所有路径使用绝对路径引用 (`@/config`, `@components/...`)
- 图片资源优先使用 `/public/` 目录或外链 CDN
- 音频文件建议控制在 10MB 以内，避免影响页面加载
- 开发时注意类型安全，充分利用 TypeScript
- 部署前检查 `astro.config.mjs` 中的 `site` 配置

## SEO 配置重要说明

### 域名重定向配置
- **当前配置**: `astro.config.mjs` 中 `site: "https://www.micostar.tech"`
- **重定向技术**: `micostar.tech` 自动重定向到 `www.micostar.tech`
- **重要性**: 确保站点地图、RSS 等生成的链接使用最终重定向后的域名

### 搜索引擎验证
- **Google Search Console**: 需要使用 `www.micostar.tech` 配置
- **Bing 站长工具**: 已添加验证标签 `D45C7B22F1891C5B0E4D62E9333D4D05`
- **站点地图**: 位于 `/sitemap-index.xml` 和 `/sitemap-0.xml`
- **RSS 订阅**: 位于 `/rss.xml`

### 配置检查清单
1. ✅ `astro.config.mjs` 站点 URL 使用重定向后域名
2. ✅ `src/config.ts` 配置文件移除重复字段
3. ✅ Layout.astro 添加 Bing 验证标签
4. ✅ RSS 生成配置正常（需要 subtitle 字段）
