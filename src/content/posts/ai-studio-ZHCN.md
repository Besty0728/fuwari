---
title: Google AI Studio的汉化插件
published: 2025-09-15T00:00:00.000Z
updated: 2025-09-15T00:00:00.000Z
description: 因为有时候使用谷歌AI Studio时会遇到语言不通的问题，又懒得开翻译（Edge有时候开自动翻译某些网站会报错）因此开发了这个汉化插件。
image: '/uploads/images/aistudio.png'
tags: [AI, 浏览器插件, 暴力猴脚本]
lang: ""
---
<p>首先确保你已经安装了暴力猴插件（Tampermonkey），如果没有安装请前往<a href="https://microsoftedge.microsoft.com/addons/detail/%E6%9A%B4%E5%8A%9B%E7%8C%B4/eeagobfjdenkkddmbclomhiblgggliao" target="_blank" rel="noopener">这里</a>下载安装。</p>
<p><img src="/uploads/images/monkey.png" alt="monkey" /></p>
<p>安装完成后在暴力猴插件的仪表盘里点击“添加新脚本”，然后将下面的代码复制粘贴进去，保存即可。</p>
<p>脚本下载请在<a href="https://cloud.ai0728.com.cn/s/pWIV/AIStudio" target="_blank" rel="noopener">这里</a>下载安装。</p>

```javascript
// ==UserScript==
// @name         Google AI Studio 汉化脚本
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  将 Google AI Studio (aistudio.google.com) 页面的主要 UI 元素翻译为中文
// @match        https://aistudio.google.com/*
// @grant        none
// @author       Betsy
// @run-at       document-start
// ==/UserScript==
(() => {
  'use strict';

  // microtask 兜底
  if (typeof window.queueMicrotask !== 'function') {
    window.queueMicrotask = (cb) => (typeof Promise === 'function'
      ? Promise.resolve().then(cb).catch(e => setTimeout(() => { throw e; }))
      : setTimeout(cb, 0));
  }

  // —— 静态与模糊词典（在此保留你的条目，略去仅示例差异） ——
  const EXACT = new Map([
    ['Block high probability of being harmful', '高概率有害，予以拦截'],
    ['Harassment', '骚扰'],['Hate', '憎恨'],['Sexually Explicit', '色情'],
    ['Block medium or high probability of being harmful', '阻止可能有害的内容'],
    ['Block low, medium and high probability of being harmful', '阻止低、中、高风险的有害内容'],
    ['Always show regardless of probability of being harmful', '无论有害的可能性如何，始终表现出来'],
    ['Get API key', '获取 API 密钥'], ['Help', '帮助'], ['Settings', '设置'], ['Create new', '新建'],
    ['Model', '模型'], ['Run', '运行'], ['Run settings', '运行设置'], ['Untitled prompt', '无标题提示'],
        ['This model is not stable and may not be suitable for production use.', '该模型不稳定，可能不适合生产环境使用。'],
    ['Off', '关闭'],['Block none', '无屏蔽'],['Block few', '屏蔽少数'],['Block some', '屏蔽一些'],['Block most', '屏蔽大部分'],
    ['Enter a prompt here', '在此处输入提示'], ['Add an example', '添加示例'], ['Input', '输入'], ['Output', '输出'],['Do not run safety filters', '不运行安全过滤器'],
    ['Get code', '获取代码'], ['Save', '保存'], ['Chat', '聊天'], ['Stream', '流式'], ['Generate media', '生成媒体'],['Run prompt', '输入提示'],['Reset defaults', '恢复默认设置'],
    ['Build', '构建'], ['History', '历史记录'], ['Dashboard', '仪表盘'], ['Documentation', '文档'],['Generate structured output', '生成结构化输出'],['Dangerous Content', '危险内容'],
    ['Temperature', '温度'], ['Top-K', 'Top‑K'], ['Top-P', 'Top‑P'], ['Advanced settings', '高级设置'],['Lets Gemini use code to solve complex tasks', '让 Gemini 使用代码来解决复杂的任务'],
    ['Safety settings', '安全设置'], ['Edit', '编辑'], ['Stop sequences', '停止序列'], ['Add stop sequence', '添加停止序列'],['Probability threshold for top-p sampling', 'top-p 采样概率阈值'],
    ['Output length', '输出长度'], ['Tools', '工具'], ['URL context', 'URL 上下文'], ['Structured output', '结构化输出'],['Maximum number of tokens in response', '响应中的最大令牌数'],['Ready to chat!', '准备好聊天了！'],['Ready to chat',  '准备好聊天了！'],
    ['Code execution', '代码执行'], ['Function calling', '函数调用'], ['Grounding with Google Search', '启用 Google 搜索基座'],['Usage & Billing', '使用情况和计费'],['Low', '低'],['Medium', '中'],
    ['Source:', '来源：'], ['Source: Google Search', '来源：Google 搜索'],['Creativity allowed in the responses', '回复内容允许创意发挥'],['Changelog', '更新日志'],['API keys', 'API密钥'],
    ['gemini-2.5-flash-image-preview', 'Gemini-2.5-flash-image-preview'],['(aka Gemini 2.5 Flash Image) State-of-the-art image generation and editing model.', '（又名 Gemini 2.5 Flash Image）最先进的图像生成和编辑模型。'],
    ['Media resolution', '媒体分辨率'], ['Default', '默认'], ['Thinking', '思考'], ['Thinking mode', '思考模式'],['Truncate response including and after string', '截断包含字符串及其之后的内容的响应'],
    ['Set thinking budget', '设置思考预算'], ['Close?', '关闭？'], ['Cancel', '取消'], ['Continue', '继续'],['Browse the url context', '浏览网址上下文'],['Lets you define functions that Gemini can call', '此工具与当前活动工具不兼容。'],
    ['Model selection', '模型选择'], ['All', '全部'], ['Featured', '精选'], ['Images', '图像'], ['New', '新'],['Adjust harmful response settings', '调整有害内容设置'],['Run safety settings', '运行安全设置'],
    ['Temporary chat', '临时聊天'], ['Reset default settings', '恢复默认设置'],['Higher resolutions may provide better understanding but use more tokens.', '更高的分辨率可能提供更好的理解，但会消耗更多 token。'],
    ['You need to create and run a prompt in order to share it', '您需要创建并运行一个提示才能分享它。'],['Lets you define functions that Gemini can call', '让您可以定义 Gemini 可以调用的函数'],
    ['System instructions', '系统指令'], ['Chat prompt', '聊天提示'], ['Compare mode', '对比模式'],['Let the model decide how many thinking tokens to use or choose your own value', '让模型决定使用多少思考令牌，或自行选择值'],
    ['Already in a new chat', '已处于新聊天'], ['Save the prompt before sharing it', '分享前请先保存提示'],['Use Google Search', '使用谷歌搜索'],['Expand prompts history', '展开对话历史'],['Create generative media', '创作生成式媒体'],
    ['View more actions', '更多操作'], ['Show conversation without markdown formatting', '以纯文本展示对话（不含 Markdown 格式）'],['Edit title and description', '编辑标题和描述'],['Collapse prompts history', '折叠对话历史'],
    ['Get SDK code to chat with Gemini', '获取与 Gemini 聊天的 SDK 代码'],['Unable to disable thinking mode for this model.', '无法为此模型禁用思考模式。'],['Enable or disable thinking for responses', '启用或禁用响应思考'],
    ['Adjust how likely you are to see responses that could be harmful. Content is blocked based on the probability that it is harmful.', '调整您看到可能有害的回复的可能性。根据内容有害的可能性被屏蔽。'],
    ['You are responsible for ensuring that safety settings for your intended use case comply with the Terms and Use Policy. Learn more.', '您有责任确保预期用例的安全设置符合条款和使用政策。了解详情。'],['Or try some examples', '或者尝试一些例子'],
    ['Try Nano Banana', '尝试Nano Banana'],['Theme', '主题'],['System', '系统'],['Dark', '暗黑'],['Light', '明亮'],['Terms of service', '服务条款'],['Privacy policy', '隐私政策'],['Send feedback', '发送反馈'],['Billing Support', '账单支持'],
    ['Showcase', '展示'],['Your apps', '你的应用'],['Recent apps', '最近的应用'],['FAQ', '常见问题'],['No apps created yet. Build your first app now.', '尚未创建任何应用。立即构建您的第一个应用程序。'],['Need some inspiration? See examples in', '需要一些灵感吗？请参阅以下示例：'],
    ['Build apps with Gemini', '使用 Gemini 构建应用'],['Start from a template', '从模板开始'],['Dynamic text game using Gemini', '使用 Gemini 的动态文本游戏'],['Gemini powered code review tool', 'Gemini 驱动的代码审查工具'],['Add files', '添加文件'],
    ['Gemini speech generation', 'Gemini 语音生成'],['Lyria RealTime', 'Lyria 实时'],['Talk to Gemini live', '与 Gemini 即时交流'],['Talk', '讲话'],['Webcam', '使用摄像头'],['Share Screen', '共享屏幕'],['Insert assets such as images, videos, folders, files, or audio', '插入图片、视频、文件夹、文件或音频等资源'],
  ]);

  const PARTIAL = [
    { pattern: /^Design a custom birthday card.*$/i, replace: '设计一张定制生日贺卡' },
    { pattern: /^Try\s+(.+)$/i, replace: '试试 $1' },
    { pattern: /^Closing the chat will lose the data\. Do you want to continue\?$/i, replace: '关闭此聊天将丢失数据，是否继续？' },
    { pattern: /\bText\b\s*[:：]\s*/i, replace: '文本：' },
    { pattern: /\bImage\b\s*\(\*?Output per image\)\s*[:：]\s*/i, replace: '图像（每张输出）：' },
    { pattern: /\bKnowledge cut ?off\b\s*[:：]\s*/i, replace: '知识截止：' },
    { pattern: /\bInput\b\s*[:：]\s*/i, replace: '输入：' },
    { pattern: /\bOutput\b\s*[:：]\s*/i, replace: '输出：' },
    { pattern: /\bWhat'?s new\b/i, replace: '最新动态' },
    { pattern: /\bTry an example app\b/i, replace: '试用示例应用' },
    { pattern: /^Add stop\b.*$/i, replace: '添加停止序列…' },
    { pattern: /\bOutput tokens?\b.*$/i, replace: '输出长度' },
    { pattern: /\bTop\s*P\b/i, replace: 'Top‑P' },
    { pattern: /\bTop\s*K\b/i, replace: 'Top‑K' },
    { pattern: /^Selected[:\s]+(.+?)$/i, replace: '已选择 $1' },
    { pattern: /\bURL context tool\b/i, replace: 'URL 上下文工具' },
    { pattern: /\bNative speech generation\b/i, replace: '原生语音生成' },
    { pattern: /\bLive audio-to-audio dialog\b/i, replace: '实时语音对话' },
    { pattern: /Google AI models may make mistakes.*double-check outputs\.?/i, replace: 'Google AI 模型可能出错，请务必复核输出。' },
    { pattern: /This model has limited free quota for testing\.?/i, replace: '此模型的免费配额仅用于测试' },
    { pattern: /To generate images beyond the limit or use the model in your projects, use the Gemini API\.?/i, replace: '若需超限生成或在项目中使用，请使用 Gemini API' },
  ];

  // —— 动态数字解析 ——
  function compactToNumber(str) {
    const m = String(str).replace(/[, ]/g, '').match(/^([\d.]+)\s*([kKmMbBtT])?$/);
    if (!m) return Number(str) || NaN;
    const n = parseFloat(m[1]);
    const s = (m[2] || '').toUpperCase();
    const factor = s === 'K' ? 1e3 : s === 'M' ? 1e6 : s === 'B' ? 1e9 : s === 'T' ? 1e12 : 1;
    return n * factor;
  }
  function formatCnShort(n) {
    if (!isFinite(n)) return '';
    if (n >= 1e12) return (n / 1e12).toFixed(n % 1e12 ? 1 : 0).replace(/\.0$/, '') + '万亿';
    if (n >= 1e8)  return (n / 1e8 ).toFixed(n % 1e8  ? 1 : 0).replace(/\.0$/, '') + '亿';
    if (n >= 1e4)  return (n / 1e4 ).toFixed(n % 1e4  ? 1 : 0).replace(/\.0$/, '') + '万';
    return String(Math.round(n));
  }

  // —— 动态句式（命名捕获 + 回调） ——
  const DYNAMIC = [
    // 模型卡：混合推理 + 上下文 + 思考预算
    {
      pattern: /Our\s+hybrid\s+reasoning\s+model,\s+with\s+(?:up\s+to\s+)?(?:an?\s+)?(?<num>[\d.,]+(?:\s*[kKmMbBtT])?)\s+token\s+context\s+window(?:\s+and\s+thinking\s+budgets)?\.?/i,
      replace: ({ groups }) => {
        const n = compactToNumber(groups?.num || '');
        const cn = isFinite(n) ? `${formatCnShort(n)} token` : `${groups?.num || ''} token`;
        return `混合推理模型，拥有 ${cn} 上下文窗口，并支持思考预算。`;
      }
    },
    // 模型卡：最强推理
    {
      pattern: /Our\s+most\s+powerful\s+reasoning\s+model,?\s+which\s+excels\s+at\s+coding\s+and\s+complex\s+reasoning\s+tasks\.?/i,
      replace: () => '最强推理模型，擅长编程与复杂推理任务。'
    },
    // 模型卡：最小高性价比
    {
      pattern: /Our\s+smallest\s+and\s+most\s+cost\s+effective\s+model,?\s+built\s+for\s+at\s+scale\s+usage\.?/i,
      replace: () => '体量最小且高性价比的模型，适用于大规模使用。'
    },
    // “知识截止：”前缀
    {
      pattern: /\bKnowledge cut ?off\b\s*:\s*(?<rest>.+)$/i,
      replace: ({ groups }) => `知识截止：${groups?.rest || ''}`
    },

    // —— 输入框动态示例（通用指令句） ——
    // Plot ... from A to B. Generate the resulting graph image.
    {
      pattern: /^Plot\s+(?<expr>.+?)\s+from\s+(?<a>.+?)\s+to\s+(?<b>.+?)\.\s*Generate\s+the\s+resulting\s+graph\s+image\.?$/i,
      replace: ({ groups }) => `绘制 ${groups?.expr || ''} 在区间 ${groups?.a || ''} 到 ${groups?.b || ''} 的曲线。生成对应的图像。`
    },
    // Explain the probability of ...
    {
      pattern: /^Explain\s+the\s+probability\s+of\s+(?<topic>.+?)\.?$/i,
      replace: ({ groups }) => `解释 ${groups?.topic || ''} 的概率。`
    },
    // Generate Python code for ...
    {
      pattern: /^Generate\s+Python\s+code\s+for\s+(?<task>.+?)\.?$/i,
      replace: ({ groups }) => `生成用于 ${groups?.task || ''} 的 Python 代码。`
    },
    // Create/Design a/an ...
    {
      pattern: /^(?:Create|Design)\s+(?:a|an)\s+(?<thing>.+?)\.?$/i,
      replace: ({ groups }) => `创建/设计 ${groups?.thing || ''}。`
    },
    // Translate X to Y
    {
      pattern: /^Translate\s+(?<src>.+?)\s+to\s+(?<dst>.+?)\.?$/i,
      replace: ({ groups }) => `将 ${groups?.src || ''} 翻译为 ${groups?.dst || ''}。`
    }
  ];

  // —— 属性与排除配置 ——
  const ATTRS = [
    'title','placeholder','alt',
    'aria-label','aria-description','aria-placeholder','aria-valuetext','aria-roledescription',
    'data-tooltip','data-title','aria-modal'
  ];
  const EXCLUDE_TAGS = new Set(['SCRIPT','STYLE','TEXTAREA','CODE','PRE']);
  const MARK = 'data-i18n-zh';
  const DIALOG_SELECTORS = [
    'dialog','[role="dialog"]','[role="alertdialog"]','[aria-modal="true"]',
    '.MuiModal-root','.MuiDialog-root','.MuiPopover-root','.MuiMenu-root','.MuiTooltip-popper',
    '.MuiSnackbar-root', '.MuiAlert-root', '[role="status"]'
  ].join(',');

  // —— 翻译器（精确 → 模糊 → 动态） ——
  function translateText(text) {
    if (!text) return null;
    const original = String(text);
    const trimmed  = original.trim();
    if (!trimmed) return null;

    if (EXACT.has(trimmed)) return original.replace(trimmed, EXACT.get(trimmed));
    for (let i = 0; i < PARTIAL.length; i += 1) {
      const { pattern, replace } = PARTIAL[i];
      if (pattern.test(original)) return original.replace(pattern, replace);
    }
    for (let i = 0; i < DYNAMIC.length; i += 1) {
      const { pattern, replace } = DYNAMIC[i];
      if (pattern.test(original)) {
        return original.replace(pattern, (...args) => {
          const last = args[args.length - 1];
          const groups = last && typeof last === 'object' ? last : undefined;
          return typeof replace === 'function' ? replace({ groups }) : replace;
        });
      }
    }
    return null;
  }

  function translateTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const nv = translateText(node.nodeValue);
    if (nv && nv !== node.nodeValue) {
      node.nodeValue = nv;
      if (node.parentElement) node.parentElement.setAttribute(MARK, '1');
    }
  }

  function translateAttributes(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
    let changed = false;
    for (let i = 0; i < ATTRS.length; i += 1) {
      const attr = ATTRS[i];
      if (el.hasAttribute(attr)) {
        const v = el.getAttribute(attr);
        const nv = translateText(v);
        if (nv && nv !== v) { el.setAttribute(attr, nv); changed = true; }
      }
    }
    if (changed) el.setAttribute(MARK, '1');
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === Node.ELEMENT_NODE && EXCLUDE_TAGS.has(root.tagName)) return;
    if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);

    let walker;
    try {
      walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          const v = n && n.nodeValue;
          if (!v || !String(v).trim()) return NodeFilter.FILTER_REJECT;
          const p = n.parentElement;
          if (!p) return NodeFilter.FILTER_ACCEPT;
          if (EXCLUDE_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
          if (p.isContentEditable) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
    } catch { return; }

    let node;
    while ((node = walker.nextNode())) translateTextNode(node);
    if (root.shadowRoot) walk(root.shadowRoot);
  }

  function observe(target) {
    if (!target) return;
    const obs = new MutationObserver((list) => {
      for (let i = 0; i < list.length; i += 1) {
        const m = list[i];
        if (m.type === 'childList') {
          for (let j = 0; j < m.addedNodes.length; j += 1) {
            const n = m.addedNodes[j];
            if (n.nodeType === Node.ELEMENT_NODE) {
              walk(n);
              if (n.matches && n.matches(DIALOG_SELECTORS)) walk(n);
              if (n.querySelector) n.querySelectorAll(DIALOG_SELECTORS).forEach(d => walk(d));
              if (n.tagName === 'IFRAME') handleIframe(n);
            } else if (n.nodeType === Node.TEXT_NODE) {
              translateTextNode(n);
            }
          }
        } else if (m.type === 'characterData') {
          translateTextNode(m.target);
        } else if (m.type === 'attributes') {
          translateAttributes(m.target);
          if (m.target.matches && m.target.matches(DIALOG_SELECTORS)) walk(m.target);
        }
      }
    });
    obs.observe(target, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
  }

  // 同源 iframe
  function handleIframe(ifr) {
    try {
      const doc = ifr.contentDocument;
      if (doc && doc.documentElement) { walk(doc.documentElement); observe(doc.documentElement); }
    } catch (e) { /* 跨源受限 */ }
  }
  function scanIframes() { document.querySelectorAll('iframe').forEach(handleIframe); }

  // SPA 路由监听
  let lastURL = location.href;
  function scheduleFullScan() {
    queueMicrotask(() => {
      lastURL = location.href;
      walk(document.documentElement);
      scanIframes();
      document.querySelectorAll(DIALOG_SELECTORS).forEach(walk);
    });
  }
  function onUrlMaybeChanged() { if (location.href !== lastURL) scheduleFullScan(); }
  const _ps = history.pushState;
  history.pushState = function (s,t,u){ const r = _ps.apply(this, arguments); onUrlMaybeChanged(); return r; };
  const _rs = history.replaceState;
  history.replaceState = function (s,t,u){ const r = _rs.apply(this, arguments); onUrlMaybeChanged(); return r; };
  window.addEventListener('popstate', onUrlMaybeChanged);
  window.addEventListener('hashchange', onUrlMaybeChanged);

  // Shadow DOM
  const _attachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (options) {
    const root = _attachShadow.call(this, options);
    if (options && options.mode === 'open') queueMicrotask(() => { walk(root); observe(root); });
    return root;
  };

  // 对话框聚焦时补扫
  window.addEventListener('focusin', (e) => {
    const el = e.target;
    if (!el || !el.closest) return;
    const dlg = el.closest(DIALOG_SELECTORS);
    if (dlg) walk(dlg);
  });

  // 启动
  function start() {
    walk(document.documentElement);
    observe(document.documentElement);
    scanIframes();
    document.querySelectorAll(DIALOG_SELECTORS).forEach(walk);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();

```
<p><img src="/uploads/images/aistudio.png" alt="monkey" /></p>
<p>安装完成后刷新 AI Studio 页面即可看到大部分界面已经被汉化了。如果发现有未汉化的地方，可以尝试点击该区域或等待一会儿，动态加载的内容有时会延迟汉化。</p>
<p>如果仍有未汉化的内容，可以将该内容截图并反馈给我，我会尽量更新词库进行补充。</p>




