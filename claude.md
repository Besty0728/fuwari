# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Astro 框架的静态博客模板，名为 Fuwari。项目使用 TypeScript、Tailwind CSS 和 Svelte 组件构建。

## 核心架构

### 技术栈
- **框架**: Astro 5.7.9 作为主要静态站点生成器
- **样式**: Tailwind CSS + Stylus 预处理器
- **组件**: Svelte 组件与 Astro 组件混合使用
- **包管理**: pnpm（版本 9.14.4）
- **类型检查**: TypeScript
- **代码质量**: Biome 用于格式化和 linting

### 目录结构
- `src/config.ts` - 主要配置文件（站点配置、导航、个人资料等）
- `src/content/posts/` - Markdown 博客文章
- `src/components/` - 可复用组件（Astro 和 Svelte）
- `src/layouts/` - 页面布局模板
- `src/pages/` - 路由页面和 API 端点
- `src/plugins/` - 自定义 remark/rehype 插件
- `src/styles/` - 全局样式文件
- `src/utils/` - 工具函数
- `scripts/` - 构建和部署脚本

### 关键特性
- 支持深色/浅色主题切换
- 页面过渡动画（Swup）
- 数学公式渲染（KaTeX）
- 代码语法高亮（Expressive Code）
- 图片回退机制
- SEO 优化（sitemap、RSS）
- IndexNow 搜索引擎提交
- 音乐播放器组件

## 常用开发命令

### 基础开发
```bash
pnpm install && pnpm add sharp  # 安装依赖
pnpm dev                        # 启动开发服务器 (localhost:4321)
pnpm build                      # 构建生产版本
pnpm preview                    # 预览构建结果
```

### 代码质量
```bash
pnpm lint                       # 使用 Biome 检查和修复代码
pnpm format                     # 格式化代码
pnpm type-check                 # TypeScript 类型检查
```

### 内容管理
```bash
pnpm new-post <filename>        # 创建新博客文章
```

### IndexNow SEO
```bash
pnpm build:indexnow            # 构建并提交到搜索引擎
pnpm submit-indexnow-inc       # 增量提交新内容
pnpm submit-indexnow-force     # 强制提交所有内容
pnpm indexnow-status           # 查看提交状态
pnpm indexnow-clear            # 清除提交历史
```

## 配置文件

### 主要配置 (`src/config.ts`)
- `siteConfig` - 网站基本信息、主题色、横幅设置
- `navBarConfig` - 导航栏链接配置
- `profileConfig` - 作者个人资料配置
- `imageFallbackConfig` - 图片回退域名配置
- `umamiConfig` - 网站分析配置

### Astro 配置 (`astro.config.mjs`)
- 网站 URL: `https://www.micostar.tech`
- 集成了 Tailwind、Svelte、Sitemap、Icon、Swup、Expressive Code
- 配置了丰富的 Markdown 处理插件链
- 自定义组件：github 卡片、提示框等

## 插件系统

### Remark 插件（Markdown 处理）
- `remark-math` - 数学公式支持
- `remark-reading-time` - 阅读时间计算
- `remark-excerpt` - 文章摘要提取
- `remark-directive` - 自定义指令支持

### Rehype 插件（HTML 处理）
- `rehype-katex` - 数学公式渲染
- `rehype-slug` - 标题 ID 生成
- `rehype-autolink-headings` - 标题锚点链接
- `rehype-external-links` - 外部链接处理
- 自定义组件：github 卡片、admonition 框

## 部署说明

- 目标平台：Vercel（默认配置）
- 构建输出：`./dist/` 目录
- 需要在部署前配置 `astro.config.mjs` 中的站点 URL

## 开发注意事项

- 使用 tab 缩进（Biome 配置）
- 双引号字符串（JavaScript/TypeScript）
- 图片支持回退机制（主图床 -> 备用图床）
- 博客文章需遵循 frontmatter 格式
- Svelte 和 Astro 文件有特殊的 linting 规则