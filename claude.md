# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 📅 最后更新：2025年9月19日
>
> 本文档用于帮助 Claude Code 快速理解 fuwari 项目的架构、功能和实现细节。

## 🔧 架构与技术栈

### 核心技术
- **框架**: Astro 5.7.9 + TypeScript
- **样式**: Tailwind CSS + CSS 变量
- **组件**: Astro + Svelte (客户端交互)
- **构建**: 静态生成 (SSG)
- **包管理**: pnpm 9.14.4
- **代码质量**: Biome (格式化 + 检查)

### 关键集成
- **页面过渡**: @swup/astro (页面切换动画)
- **代码高亮**: astro-expressive-code (自定义主题)
- **搜索引擎**: @astrojs/sitemap + @astrojs/rss
- **数学公式**: rehype-katex + remark-math
- **图标**: astro-icon (@iconify 图标集合)

### 自定义插件架构
```
src/plugins/
├── rehype-*                  # HTML 后处理插件
│   ├── image-fallback.mjs    # 图片回退机制
│   ├── image-attrs.mjs       # 图片属性处理
│   └── component-*.mjs       # 自定义组件 (admonition, github-card)
├── remark-*                  # Markdown 预处理插件
│   ├── reading-time.mjs      # 阅读时间计算
│   ├── excerpt.js            # 文章摘要提取
│   └── directive-rehype.js   # 指令解析
└── expressive-code/          # 代码块扩展
    ├── custom-copy-button.ts # 自定义复制按钮
    └── language-badge.ts     # 语言标识
```

## 🏗️ 项目结构

```
fuwari/
├── src/
│   ├── config.ts                   # 全局配置（站点/导航/个人/统计/图片回退/代码主题）
│   ├── components/                 # UI 组件
│   │   ├── Navbar.astro            # 导航栏（集成 MusicPlayer 与 Search）
│   │   ├── MusicPlayer.svelte      # 音乐播放器（HTML5 Audio + CSS 动画）
│   │   ├── Search.svelte           # 客户端搜索组件
│   │   ├── PostCard.astro          # 文章卡片
│   │   ├── PostMeta.astro          # 文章元信息
│   │   ├── PostPage.astro          # 文章页面
│   │   ├── Footer.astro            # 页脚
│   │   └── widget/…                # 设置/菜单等小部件
│   ├── content/
│   │   ├── config.ts               # 内容集合 Schema（posts/spec/assets）
│   │   ├── posts/                  # 博客文章 (Markdown)
│   │   └── spec/                   # 规范类文档
│   ├── pages/                      # 页面路由
│   │   ├── [...page].astro         # 首页分页
│   │   ├── about.astro             # 关于
│   │   ├── apps.astro              # 应用
│   │   ├── donate.astro            # 赞助
│   │   ├── archive/                # 归档
│   │   ├── rss.xml.ts              # RSS 输出
│   │   └── robots.txt.ts           # robots 输出
│   ├── plugins/                    # 自定义插件
│   │   ├── rehype-image-fallback.mjs
│   │   ├── rehype-image-attrs.mjs
│   │   ├── rehype-component-admonition.mjs
│   │   ├── rehype-component-github-card.mjs
│   │   ├── remark-reading-time.mjs
│   │   ├── remark-excerpt.js
│   │   ├── remark-directive-rehype.js
│   │   └── expressive-code/…       # 代码块扩展（自定义复制按钮等）
│   ├── utils/                      # 工具函数
│   │   ├── content-utils.ts        # 文章排序/前后文链接/标签统计
│   │   └── url-utils.ts 等
│   ├── types/                      # 类型定义
│   └── styles/                     # 样式
├── public/
│   ├── music/                      # 音频资源（当前存在 background.flac）
│   └── uploads/、favicon/ 等
├── astro.config.mjs                # Astro 配置（集成 Tailwind、Svelte、Swup、Sitemap、Expressive Code 等）
├── tailwind.config.cjs             # Tailwind 配置
└── package.json                    # 依赖与脚本
```

## 🔧 核心配置说明

所有配置统一管理在 `src/config.ts`，包含：

### 站点配置 (siteConfig)
- **基础信息**: title, subtitle, description, lang
- **主题设置**: themeColor (hue: 361, 强制深色模式)
- **背景系统**: 支持 CDN 图片背景 + 透明度控制
- **横幅配置**: 可选的页面横幅系统
- **目录设置**: TOC 显示深度控制
- **应用集合**: 外部应用链接展示

### 导航配置 (navBarConfig)
- **内置预设**: Home, Archive, About (LinkPreset)
- **自定义链接**: 支持内部/外部链接
- **外部服务**: Umami 统计、UptimeRobot 状态页

### 个人资料 (profileConfig)
- **头像设置**: 支持 CDN 或本地路径
- **社交链接**: 自动图标 + URL (支持 Iconify)

## 🎯 开发工作流与架构重点

### 关键架构模式
1. **配置驱动**: 所有定制化通过 `src/config.ts` 统一管理
2. **插件化扩展**: Markdown 处理通过 remark/rehype 插件链
3. **类型安全**: 严格 TypeScript + Zod schema 验证
4. **静态优先**: 纯静态生成，客户端交互仅限搜索和音乐播放器

### 内容集合 Schema (`src/content/config.ts`)
```typescript
// posts: 主要博客文章集合
// spec: 规范文档集合 (可选元信息)
// assets: 数据集合 (type: 'data')
```

### Markdown 处理流水线
```
Markdown 源文件
├── remark 插件 (AST 预处理)
│   ├── remarkReadingTime → 阅读时间计算
│   ├── remarkExcerpt → 摘要提取
│   ├── remarkDirective → 指令解析 (:::note 等)
│   └── remarkMath → 数学公式预处理
└── rehype 插件 (HTML 后处理)
    ├── rehypeKatex → 数学公式渲染
    ├── rehypeImageFallback → 图片回退
    ├── rehypeComponents → 自定义组件
    └── rehypeExternalLinks → 外链处理
```

### 组件架构说明
- **布局组件**: `src/layouts/Layout.astro` (全局布局)
- **页面组件**: `src/pages/*.astro` (路由页面)
- **UI 组件**: `src/components/*.astro` (可复用组件)
- **交互组件**: `src/components/*.svelte` (客户端状态管理)

## 🎨 主题系统

### 1. 颜色与主题
- 强制深色（siteConfig.themeColor.forceDarkMode = true）
- HSL 色调自定义（hue: 361），访客主题色选择已隐藏（fixed: true）
- CSS 变量驱动（与 Tailwind 配合）

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

### 1. 新建文章流程
```bash
# 自动创建带前置元数据的文章
pnpm new-post "my-new-article"  # 创建 src/content/posts/my-new-article.md
```

### 2. 文章前置元数据格式
```yaml
---
title: 文章标题                    # 必填
published: 2025-08-12T08:35:00.000Z  # 必填，发布时间
updated: 2025-08-19T23:19:03.000Z    # 可选，更新时间
description: 文章描述              # 可选，SEO 描述
image: '/uploads/images/cover.png'   # 可选，封面图片
tags: [标签1, 标签2]               # 可选，标签数组
lang: ""                          # 可选，覆盖站点默认语言
pinned: false                     # 可选，是否置顶
draft: false                      # 可选，是否为草稿

# 以下字段由系统自动填充，用于前后文链接
prevTitle: ""
prevSlug: ""
nextTitle: ""
nextSlug: ""
---
```

### 3. 文章排序逻辑 (`src/utils/content-utils.ts`)
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
- 基于 Svelte 的客户端搜索组件 `Search.svelte`
- 支持即时搜索与结果展示（页面右侧工具区）

### 4. 音乐播放器 🎵
```typescript
// 集成在导航栏的音乐播放器组件 (MusicPlayer.svelte)
// 位置：导航栏右侧工具区域，紧邻搜索框之前（见 Navbar.astro）
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

备注：当前 `public/music/` 下存在 `background.flac`，建议补充 `background.mp3` 以增强兼容性（组件已内置回退逻辑）。

### 5. 页面过渡动画
```typescript
// 使用 Swup 实现页面切换动画
swup({
  theme: false,
  animationClass: "transition-swup-",
  containers: ["main", "#toc"],
  smoothScrolling: true,
  cache: true,
  preload: true,
  accessibility: true,
  updateHead: true,
  updateBodyClass: false,
  globalInstance: true
})
```

## 📊 集成服务

### 1. 网站统计（Umami）
```typescript
export const umamiConfig: UmamiConfig = {
  enable: true,
  baseUrl: "https://us.umami.is",
  shareId: "统计ID",
  timezone: "Asia/Shanghai"
};
```
导航中已提供外链“统计”至 Umami 分享页。

### 2. RSS 订阅
- 由 `src/pages/rss.xml.ts` 生成 `/rss.xml`
- 包含最新文章摘要

### 3. SEO 与可发现性
- Sitemap：`@astrojs/sitemap` 集成
- RSS：详见上文
- 外链处理：`rehype-external-links` 自动添加 `target="_blank"`
- 标题锚点：`rehype-slug` + `rehype-autolink-headings` 自定义 `#` 图标

## 🚀 开发与部署

### 常用开发命令
```bash
# 开发与构建
pnpm dev                      # 启动开发服务器 (localhost:4321)
pnpm start                    # 开发服务器别名
pnpm build                    # 构建生产版本到 ./dist/
pnpm preview                  # 预览构建结果

# 内容管理
pnpm new-post <filename>      # 创建新文章 (使用 scripts/new-post.js)

# 代码质量
pnpm type-check               # TypeScript 类型检查 (--noEmit --isolatedDeclarations)
pnpm format                   # 代码格式化 (Biome)
pnpm lint                     # 代码检查 (Biome)

# Astro 工具
pnpm astro ...                # 运行 Astro CLI 命令
pnpm astro --help             # Astro CLI 帮助
```

### 数据迁移
```bash
# SQLite 博客迁移 (实验性功能)
pnpm node scripts/migrate-from-sqlite.mjs --db "path/to/database.db" --dry-run  # 预览
pnpm node scripts/migrate-from-sqlite.mjs --db "path/to/database.db" --out ./src/content/posts  # 迁移
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
| `src/components/MusicPlayer.svelte` | 音乐播放器组件（右侧工具区） | ⭐⭐⭐ |
| `src/pages/[...page].astro` | 首页分页逻辑 | ⭐⭐⭐⭐ |
| `public/music/` | 音频文件存储目录 | ⭐⭐⭐ |
| `astro.config.mjs` | Astro 框架配置 | ⭐⭐⭐ |
| `src/plugins/` | 自定义插件目录（rehype/remark/expressive-code） | ⭐⭐⭐ |

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
  - 位置：导航栏右侧工具区，紧邻搜索框之前
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
- 资源路径优先使用 `/public/` 或稳定 CDN；图片启用回退（见 imageFallbackConfig）
- 音频文件建议控制在 10MB 以内，避免首屏负担
- 类型安全：充分利用 TypeScript 类型（见 `src/types/`）
- 部署前检查 `astro.config.mjs` 中的 `site` 与 `base` 配置

## SEO 配置重要说明

### 域名与站点配置
- `astro.config.mjs` 设置：`site: "https://www.micostar.tech"`，`base: "/"`，`trailingSlash: "always"`
- 建议：外部重定向将 `micostar.tech` 统一至 `www.micostar.tech`，以保证 sitemap/RSS 的一致性

### 搜索引擎与可见性
- Google Search Console：建议使用 `www.micostar.tech` 属性
- Bing 站长：如需标签验证，请在布局中注入对应 meta 标签
- 站点地图：`/sitemap-index.xml` 与 `/sitemap-0.xml`
- RSS 订阅：`/rss.xml`

---

## ⚠️ Claude Code 注意事项

### 部署前必检查
1. **站点配置**: `astro.config.mjs` 中的 `site` URL 必须与部署域名一致
2. **图片回退**: 确保 `imageFallbackConfig` 中的图床域名可访问
3. **外部链接**: 导航栏中的统计和状态页链接需有效
4. **音频文件**: `public/music/` 目录下需有对应的音频文件

### 类型安全与验证
- 修改配置时必须遵循 `src/types/config.ts` 中的类型定义
- 文章 frontmatter 受 `src/content/config.ts` schema 约束
- 使用 `pnpm type-check` 验证 TypeScript 类型

### 代码质量标准
- 提交前运行 `pnpm lint` 和 `pnpm format`
- 使用 Biome 统一代码风格 (配置在 `biome.json`)
- 组件优先使用 Astro，仅交互部分使用 Svelte

### 性能考虑
- 图片优化: 使用 Sharp 自动压缩和格式转换
- 音频文件: 建议 < 10MB，提供 FLAC + MP3 双格式
- 静态资源: 优先使用稳定 CDN，启用图片回退机制

---

修订概要（相对上一版）：
- 增加 Claude Code 专用前缀格式
- 重新组织开发命令和架构说明
- 补充详细的 Markdown 处理流水线
- 增加针对 Claude Code 的注意事项和最佳实践

