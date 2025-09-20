# IndexNow 搜索引擎快速收录功能

本项目已集成 IndexNow 协议，可以自动向 Bing、Yandex 等支持的搜索引擎快速提交 URL，加速网站内容的索引收录。

## 🚀 功能特点

- **自动收集 URL**：从构建后的 sitemap 中自动提取所有页面 URL
- **多搜索引擎支持**：同时提交到 IndexNow API、Bing、Yandex
- **构建时自动提交**：每次构建完成后自动提交新增链接
- **手动管理界面**：提供 Web 界面手动触发提交
- **错误容灾**：提交失败不影响正常部署流程

## 📁 相关文件

### 核心文件
- `public/751fa2696f5b4f5890799ca542b34fbb.txt` - IndexNow 验证密钥文件
- `src/pages/api/indexnow.ts` - IndexNow API 端点
- `scripts/submit-indexnow.mjs` - 自动提交脚本
- `src/pages/indexnow.astro` - Web 管理界面

### 配置文件
- `package.json` - 添加了新的脚本命令
- `src/config.ts` - 导航栏配置（添加"收录"链接）
- `.github/workflows/deploy.yml` - CI/CD 工作流

## 🛠️ 使用方法

### 1. 命令行使用

```bash
# 构建并自动提交（推荐）
pnpm build:indexnow

# 仅提交（不构建）
pnpm submit-indexnow

# 普通构建（不提交）
pnpm build
```

### 2. Web 界面使用（隐私访问）

访问 `https://www.micostar.tech/admin-indexnow-7c8a9b2d/` 使用管理界面：

- 🔒 **隐私保护**：URL 路径已隐藏，不会出现在导航或搜索中
- 查看配置状态和密钥信息
- 手动触发 URL 提交
- 查看提交结果详情和所有 URL 列表
- 仅限管理员个人使用

### 3. API 使用

```bash
# GET - 查看配置信息
curl https://www.micostar.tech/api/indexnow

# POST - 手动提交所有 URL
curl -X POST https://www.micostar.tech/api/indexnow

# Webhook - Vercel 部署钩子（需要认证）
curl -X POST https://www.micostar.tech/api/webhook/indexnow \
  -H "Authorization: Bearer indexnow-webhook-2024"
```

## 🔄 自动化流程

### 本地开发
当您运行 `pnpm build:indexnow` 时：
1. 执行 Astro 构建
2. 生成 sitemap 文件
3. 自动提取所有 URL
4. 提交到搜索引擎

### Vercel + GitHub Actions
**Vercel 部署**：自动同步 GitHub 仓库并部署
**GitHub Actions**：每次推送到 `main` 分支时：
1. 自动构建网站以生成最新的 sitemap
2. 提交 URL 到 IndexNow（独立于部署流程）
3. 部署由 Vercel 单独处理

**或者使用 Vercel Deploy Hook**：
- 在 Vercel 项目设置中配置 Deploy Hook
- 指向 `/api/webhook/indexnow` 端点
- 每次部署完成后自动触发 IndexNow 提交

## 📊 提交的内容

IndexNow 会自动提交以下类型的页面：

- **主要页面**：首页、关于、应用、赞助、归档等
- **博客文章**：所有已发布的文章页面
- **标签页面**：所有标签分类页面
- **系统页面**：RSS、Sitemap 等

## � 隐私与安全

### 访问控制
- **隐藏管理界面**：管理页面使用随机 URL 路径，不会出现在导航或 sitemap 中
- **API 端点保护**：Webhook 端点需要认证 token
- **无公开链接**：所有管理功能都是隐式的，只有知道 URL 的人才能访问

### 推荐设置
1. **管理页面**：`/admin-indexnow-7c8a9b2d/` - 仅个人知晓
2. **API 端点**：公开可访问，但不包含敏感信息
3. **Webhook**：需要 Bearer token 认证

### 安全建议
- 不要在公开场合分享管理页面 URL
- 定期更换 webhook token（在代码中修改）
- 监控访问日志，发现异常访问

## �🔧 技术细节

### IndexNow 协议
- **验证方式**：通过密钥文件 `751fa2696f5b4f5890799ca542b34fbb.txt`
- **提交格式**：JSON 格式，符合 IndexNow 1.0 规范
- **响应码**：
  - `200` - 成功接收并处理
  - `202` - 成功接收，稍后处理
  - `400` - 请求格式错误
  - `403` - 密钥验证失败
  - `422` - URL 格式错误或过多
  - `429` - 请求频率过高

### 支持的搜索引擎
1. **IndexNow API** (`api.indexnow.org`) - 通用端点
2. **Bing** (`www.bing.com/indexnow`) - 微软必应
3. **Yandex** (`yandex.com/indexnow`) - 俄罗斯搜索引擎

## 📈 最佳实践

1. **发布新文章后**：运行 `pnpm build:indexnow` 快速收录
2. **定期提交**：建议每周手动提交一次确保同步
3. **监控结果**：通过 Web 界面查看提交状态
4. **避免频繁提交**：IndexNow 有频率限制，建议批量提交

## 🚨 注意事项

- 密钥文件必须放在网站根目录且可公开访问
- 提交的 URL 必须是当前域名下的有效链接
- IndexNow 不保证立即索引，只是加快处理速度
- 某些搜索引擎可能不支持 IndexNow 协议

## 🔍 故障排除

### 常见问题

1. **403 错误**：检查密钥文件是否正确放置在 `public/` 目录
2. **422 错误**：检查 URL 格式，确保域名匹配
3. **网络错误**：检查网络连接，某些地区可能无法访问部分端点

### 调试方法

```bash
# 查看详细日志
pnpm submit-indexnow

# 检查 API 状态
curl https://www.micostar.tech/api/indexnow

# 验证密钥文件
curl https://www.micostar.tech/751fa2696f5b4f5890799ca542b34fbb.txt
```

---

更多信息请参考：
- [IndexNow 官方文档](https://www.indexnow.org/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters/)
- [Yandex Webmaster](https://webmaster.yandex.com/)