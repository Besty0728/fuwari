# 📝 博客编写和更新完整指南

## 🚀 快速开始

### 创建新文章
```bash
npm run new-post -- "文章标题"
```

### 本地预览
```bash
npm run dev
```
访问: http://localhost:4321

### 构建博客
```bash
npm run build
```

## 📄 文章结构

### Front Matter (文章头部信息)
```yaml
---
title: 文章标题                    # 必填
published: 2025-09-02T20:10:14    # 发布时间
description: '文章描述'            # SEO描述
image: 'https://example.com/img.jpg'  # 封面图片
tags: [标签1, 标签2, 标签3]       # 标签
category: 分类名称                # 分类
draft: false                      # 是否为草稿
lang: ''                         # 语言(默认继承配置)
---
```

### Markdown 内容格式

#### 标题
```markdown
# 一级标题
## 二级标题
### 三级标题
```

#### 图片
```markdown
# 使用您的双CDN图床
![图片描述](https://image.ai0728.com.cn/your-image.jpg)

# 本地图片（放在 public/uploads/images/ 目录下）
![本地图片](/uploads/images/example.png)

# 相对路径本地图片
![本地图片](./images/local-image.jpg)
```

#### 代码块
````markdown
```javascript
function hello() {
    console.log("Hello World!");
}
```
````

#### 链接
```markdown
[链接文字](https://example.com)
```

#### 列表
```markdown
1. 有序列表
2. 项目二

- 无序列表
- 项目二
```

#### 引用
```markdown
> 这是一个引用块
```

#### 表格
```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
```

#### 文本样式
```markdown
# 基本样式
**加粗文本**
*斜体文本*
***加粗斜体***
~~删除线~~

# 下划线（使用HTML标签）
<ins>带下划线的文本</ins>

# 红色加粗警告文本（推荐方式）
<span style="color: red; font-weight: bold;">重要警告信息</span>

# 其他颜色文本
<span style="color: blue;">蓝色文本</span>
<span style="color: green;">绿色文本</span>
<span style="color: orange;">橙色文本</span>

# 组合样式
<span style="color: red; font-weight: bold; text-decoration: underline;">红色加粗下划线</span>
```

## 🖼️ 图片管理

### 双CDN图床配置
已配置的图床系统：
- 主图床: `image.ai0728.com.cn`
- 备用图床: `image.cloudrunmax.top`

### 图片使用方式

1. **直接使用图床链接**
```markdown
![图片](https://image.ai0728.com.cn/your-image.jpg)
```

2. **本地图片**
将图片放在 `src/content/posts/` 相对路径下：
```markdown
![本地图片](./images/example.jpg)
```

3. **封面图片**
在 Front Matter 中设置：
```yaml
image: 'https://image.ai0728.com.cn/cover.jpg'
```

## 📂 文件组织

### 目录结构
```
src/content/posts/
├── 我的第一篇博客.md
├── Vercel部署指南.md
├── images/                 # 图片目录
│   ├── post1/
│   └── post2/
└── assets/                 # 其他资源
```

### 分类建议
- **技术教程**: 详细的技术指南
- **项目分享**: 个人项目介绍
- **学习笔记**: 学习心得和总结
- **博客日志**: 个人动态和想法
- **工具推荐**: 实用工具介绍

## 🔄 更新流程

### 1. 写作流程
```bash
# 1. 创建新文章
npm run new-post -- "新文章标题"

# 2. 编辑文章
# 使用你喜欢的编辑器编辑 .md 文件

# 3. 本地预览
npm run dev

# 4. 提交更改
git add .
git commit -m "添加新文章: 新文章标题"
git push origin main
```

### 2. 自动部署
- 推送到 GitHub 后，Vercel 会自动构建和部署
- 部署时间通常 2-5 分钟
- 可在 Vercel Dashboard 查看部署状态

### 3. 更新现有文章
1. 直接编辑对应的 `.md` 文件
2. 修改 `published` 时间（如需要）
3. 提交并推送更改

## 🎨 写作技巧

### 1. 标题层次
- 使用清晰的标题层次结构
- 避免跳级使用标题（如从 h1 直接到 h3）

### 2. 代码高亮
支持的语言：
- `javascript`, `python`, `bash`, `css`, `html`
- `csharp`, `unity`, `json`, `yaml`

### 3. 内容结构
建议的文章结构：
```markdown
# 主标题

## 前言/介绍

## 主要内容
### 子主题1
### 子主题2

## 实践示例

## 总结

## 参考链接
```

## 🎨 实用格式示例

### 1. 图片使用最佳实践
```markdown
# 教程中的截图（放在 public/uploads/images/ 目录）
![命令行界面](/uploads/images/ML.png)
![用户管理界面](/uploads/images/UserM.png)
![文件夹结构](/uploads/images/Users.png)

# 带描述的图片
![资源监视器界面 - 用于查看和管理系统进程](/uploads/images/ZYGL.png)
```

### 2. 重要提示和警告
```markdown
# 红色加粗警告（推荐方式）
<span style="color: red; font-weight: bold;">需要重启则重启，后续仍选择超级管理员，误进入原来的用户导致错乱后果自负！！！</span>

# 其他提示样式
<span style="color: orange; font-weight: bold;">注意事项</span>
<span style="color: blue; font-weight: bold;">提示信息</span>
```

### 3. 步骤编号格式
```markdown
1. 首先你需要...
   ![相关截图](/uploads/images/step1.png)

2. 然后按下Alt+F4...

3. 在任务管理器（Ctrl+Shift+Esc）...
   ![任务管理器界面](/uploads/images/UserM.png)
```

### 4. 代码和路径高亮
```markdown
# 命令代码块
```bash
net user administrator /active:yes
```

# 文件路径
```plaintext
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList\S-1-5-21-xxx
```

# 重要参数名
修改<ins>**ProfileImagePath**</ins>
```

### 5. 键盘快捷键格式
```markdown
# 标准快捷键格式
按下Alt+F4
使用Ctrl+Shift+Esc
Win+R组合键
```

## 🔧 高级功能

### 1. 草稿功能
```yaml
draft: true  # 设置为草稿，不会在网站上显示
```

### 2. 多语言支持
```yaml
lang: 'en'  # 设置文章语言
```

### 3. 自定义样式
可以在文章中使用 HTML 标签和内联样式：
```html
<div class="custom-style">
  自定义内容
</div>

<!-- 推荐的文本样式方法 -->
<span style="color: red; font-weight: bold;">重要提示</span>
<span style="background-color: yellow;">高亮文本</span>
<ins>下划线文本</ins>
```

## 📊 SEO 优化

### 1. 描述优化
```yaml
description: '简洁明了的文章描述，包含关键词，控制在150字符内'
```

### 2. 标签使用
- 每篇文章 3-5 个标签
- 使用相关的技术标签
- 保持标签的一致性

### 3. 图片 Alt 文本
```markdown
![具体描述图片内容的Alt文本](image-url.jpg)
```

## 🐛 常见问题

### Q: 图片不显示怎么办？
A: 检查图片链接是否正确，或使用备用CDN

### Q: 文章没有出现在网站上？
A: 检查 `draft: false` 和 `published` 时间

### Q: 代码高亮不生效？
A: 确保语言标识符正确，检查代码块格式

### Q: 如何删除文章？
A: 直接删除对应的 `.md` 文件并提交

### Q: 红色加粗文本不显示怎么办？
A: 使用 `<span style="color: red; font-weight: bold;">文本</span>` 而不是 `<font>` 标签

### Q: 本地图片不显示？
A: 确保图片放在 `public/uploads/images/` 目录下，使用 `/uploads/images/filename.png` 路径

### Q: HTML样式不生效？
A: 确保使用内联样式 `style="..."` 而不是CSS类名

## 🔗 有用的资源

- [Markdown 语法指南](https://markdown.com.cn/)
- [Astro 文档](https://docs.astro.build/)
- [Vercel 文档](https://vercel.com/docs)

---

🎉 **恭喜！** 现在您已经掌握了博客的完整使用方法！开始您的写作之旅吧！
