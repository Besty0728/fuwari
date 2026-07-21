# 随机背景方向修复 - 验收清单

> 对应修复：随机背景通过 `new Image()` 探测 `naturalWidth/naturalHeight` 校验方向，最多重试 3 次，并按横竖屏缓存到 `sessionStorage`。

## 自动/半自动验收

### 1. API 前提假设验证
- [x] 桌面 UA 访问 `https://img.micostar.cc/random` 返回 302 并落到 `/images/horizontal/*.webp`
- [x] iPhone UA 访问返回 302 并落到 `/images/vertical/*.webp`
- [x] iPad UA 访问返回 302 并落到 `/images/vertical/*.webp`（iPad 横屏时 UA 方向与实际屏幕方向不一致，正是本次修复的核心场景）
- [x] 带 `X-Requested-With: XMLHttpRequest` 请求存在 `Access-Control-Allow-Origin: *`
- [x] 同 UA 连续请求 3 次方向一致且结果不同（随机性成立）

### 2. 脚本运行
- [x] `node scripts/verify-random-bg.mjs` 输出 PASS/FAIL 表格且 6/6 通过

## 人工/浏览器 DevTools 验收

### 首屏与随机模式
- [ ] 手机竖屏（Chrome DevTools iPhone 14 Pro）：切换到随机模式，首屏背景为竖图，无拉伸/裁切异常
- [ ] iPad 横屏（DevTools iPad + 旋转为 landscape）：切换到随机模式，首屏背景为横图，而非因 UA 被分配到竖图
- [ ] 桌面横屏（普通桌面浏览器）：切换到随机模式，首屏背景为横图

### 固定与随机切换
- [ ] 点击右上角骰子按钮，背景从固定图平滑切换为随机图，按钮图标变为 `casino`
- [ ] 再次点击，背景恢复为当前方向对应的固定图，按钮图标恢复为 `image`
- [ ] 切换后刷新页面，模式保持（localStorage `bg-mode`）

### 横竖屏旋转
- [ ] 随机模式下旋转设备/调整窗口：横屏显示横图，竖屏显示竖图
- [ ] 固定模式下旋转设备/调整窗口：横屏显示固定横图，竖屏显示固定竖图
- [ ] 旋转时无白屏、无方向错误停留超过 1 秒

### Swup 页面切换
- [ ] 随机模式下点击链接跳转到另一页，背景仍保持随机图，模式不重置为固定
- [ ] 固定模式下跳转，背景保持固定图

### 缓存与网络请求
- [ ] 随机模式下在同一方向内连续刷新/切换页面，`sessionStorage` 键 `bg-random-url-landscape` 或 `bg-random-url-portrait` 已缓存 URL
- [ ] 同一方向下再次进入随机模式，Network 面板不再发起新的 `/random` 请求，直接命中缓存
- [ ] 方向变化后（如 portrait → landscape），应重新请求新的 `/random` 并更新对应方向缓存

### 降级与稳定性
- [ ] 网络异常或图片加载失败时，最多重试 3 次后仍有背景显示（即使方向可能不完全匹配）
- [ ] 无 JavaScript 报错阻塞页面渲染

## 本地验证命令

构建工具可用（Astro）：

```bash
# 开发预览
npm run dev        # 默认 http://localhost:4321

# 构建
npm run build

# 构建后预览
npm run preview    # 默认 http://localhost:4321
```

修复完成后建议流程：
1. `npm run build` 确认构建无错误。
2. `npm run preview` 在本地 4321 端口启动生产预览。
3. 用浏览器 DevTools 切换设备/横竖屏，逐项勾选上方验收清单。
