---
title: 我的ClaudeCode使用笔记
published: 2025-09-20T19:33:12
description: '最近正式在一些项目开始使用ClaudeCode，记录一些使用笔记。'
image: '/uploads/images/claude.png'
tags: [AI, ClaudeCode使用笔记]

draft: false 
lang: ''
---
# ClaudeCode使用笔记
或者前往[这里](https://claudecode.ai0728.com.cn)
## 🧭ClaudeCode官方文档

有空更建议研究ClaudeCode官方文档

[Claude Code 概述 - Claude Docs](https://docs.claude.com/zh-CN/docs/claude-code/overview)

---

## 🔥 重要指令

| 命令 | 功能 | 代码特殊示例 |
| --- | --- | --- |
| **/mcp** | 管理 MCP 服务器连接与调试，查看可用服务、状态与权限 | /mcp list 或 /mcp status |
| **/init** | [生成CLAUDE.md](http://生成CLAUDE.md)；作为项目知识，每次对应项目对话都附带，是AI了解项目的基石《项目提示词》 | 无 |
| **/compact** | 压缩对话上下文，更节省Token消耗；可以附加提示词选择更侧重哪一方面（增加注意力） | /compact 主要保留前端部分对话 |
| **/clear** | 用于清除对话记录 | 无 |
| **think/thinkhard/thinkharder/ultrathink** | 这四个级别的提示词代表用于AI对问题的的思考程度 | think “你的需求” |
| **！** | 进入临时命令行模式，同时操作也可以被AI感知 | ！ npm install 安装依赖并通知AI |
| **#** | 长期记忆模式，给项目或我们用户级别添加要Claude知道的东西（[附加于CLAUDE.md](http://附加于CLAUDE.md)文件下）用户级别的位于C/User/用户名/.claude文件夹下 | # 用中文与我对话 |
| **/ide** | 开启ide集成（非常方便，注意要下载对应的插件）使用后，以VSCode举例，接近于VSCode原生Github Copilot下的Agent模式体验 | 无 |
| **claude -p “问题”** | 临时一次性对话，类似于一次性的Olllma本地模型 |  |

---

## 📝 常用命令参考

<aside>
⭐高频操作集合，建议优先记忆
</aside>

### 基础命令

| 命令 | 功能 | 示例 |
| --- | --- | --- |
| **claude** | 启动交互模式 | claude |
| **claude "task"** | 运行一次性任务 | claude "fix the build error" |
| **claude -p "query"** | 运行查询后退出 | claude -p "explain this function" |
| **claude -c** | 继续最近的对话 | claude -c |
| **claude -r** | 继续上一个对话 | claude -r |
| **claude commit** | 创建 Git 提交（个人不常用） | claude commit |

---

### 交互模式命令

| 命令 | 功能 |
| --- | --- |
| **/clear** | 清除对话历史记录 |
| **/help** | 获取帮助信息 |
| **exit 或 Ctrl+C** | 退出 Claude Code |
---

### 内置斜杠命令

<aside>
⚠️重要：IDE 绑定与上下文同步请使用 /ide（首次在 IDE 终端运行 claude 后，输入 /ide 选择要绑定的 IDE）。

环境变量：

ANTHROPIC_BASE_URL 自定义请求地址

ANTHROPIC_AUTH_TOKEN  自定义密钥

</aside>

| 命令 | 用途 |
| --- | --- |
| **/ide** | 重要 绑定 IDE 并启用选择、诊断、差异等上下文同步 |
| **/add-dir** | 添加额外的工作目录 |
| **/bug** | 报告错误 |
| **/clear** | 清除对话历史 |
| **/config** | 查看/修改配置 |
| **/cost** | 显示令牌使用统计 |
| **/doctor** | 检查安装健康状况 |
| **/help** | 获取使用帮助 |
| **/init** | 使用 [CLAUDE.md](http://CLAUDE.md) 初始化项目 |
| **/memory** | 编辑 [CLAUDE.md](http://CLAUDE.md) 内存文件 |
| **/model** | 选择或更改 AI 模型 |
| **/permissions** | 查看或更新权限（Allow始终允许、Deny禁止使用、Workspace是项目始终允许） |
| **/review** | 请求代码审查 |
| **/status** | 查看账户和系统状态 |
| **/vim** | 进入 vim 模式 |
| **/resume** | 找回历史话题（仅回退对话记录，无代码） |
| **/export** | 将此次对话内容导出（粘贴板/文件） |

<aside>
💡
小提示：遇到上下文不全时，先用 /permissions 检查权限，再用 /add-dir 补充目录。

</aside>

---

## 🧩 MCP 模块

### MCP 工具与权限

| 工具 | 描述 | 需要权限 |
| --- | --- | --- |
| Bash | 在您的环境中执行 shell 命令 | 是 |
| Edit | 对特定文件进行有针对性的编辑 | 是 |
| Glob | 基于模式匹配查找文件 | 否 |
| Grep | 在文件内容中搜索模式 | 否 |
| MultiEdit | 对单个文件原子性地执行多个编辑 | 是 |
| NotebookEdit | 修改 Jupyter notebook 单元格 | 是 |
| NotebookRead | 读取和显示 Jupyter notebook 内容 | 否 |
| Read | 读取文件内容 | 否 |
| Task | 运行子代理来处理复杂的多步骤任务 | 否 |
| TodoWrite | 创建和管理结构化任务列表 | 否 |
| WebFetch | 从指定 URL 获取内容 | 是 |
| WebSearch | 执行带有域过滤的网络搜索 | 是 |
| Write | 创建或覆盖文件 | 是 |

<aside>
🔧
在此处记录与 MCP（Model Context Protocol）相关的服务器、客户端、工具链与调试笔记。**注意安装时建议退出ClaudeCode**

</aside>

---

### 参考命令

| 命令 | 功能 | 示例 |
| --- | --- | --- |
| claude mcp add “mcp名称，建议与MCP相同” | 增加MCP | claude mcp add context7 — npx @upstash/context7-mcp
这个就是按照文档里的来，结构为
claude mcp add MCP名称 — “command” + “args” |
| — scope user | 添加为用户级别的MCP | 就是在上文的MCP名称后添加
示例：claude mcp add context7 —scope user   — npx @upstash/context7-mcp |
| /mcp | 查看mcp服务器 | 无 |
| claude mcp remove MCP名称 | 删除该MCP服务器 | claude mcp remove context7 |
| /permissions进入后选择Allow后mcp__MCP名称 | 位于Allow下面的工具/MCP无需确认，自动使用 | mcp__ context7 |
| claude —dangerously-skip-permissions | 赋予最高权限 | 无 |

---

### 远程连接MCP视MCP文档命令即可

## 🔧工具与权限

| 工具 | 描述 | 需要权限 |
| --- | --- | --- |
| Bash | 在您的环境中执行 shell 命令 | 是 |
| Edit | 对特定文件进行有针对性的编辑 | 是 |
| Glob | 基于模式匹配查找文件 | 否 |
| Grep | 在文件内容中搜索模式 | 否 |
| MultiEdit | 对单个文件原子性地执行多个编辑 | 是 |
| NotebookEdit | 修改 Jupyter notebook 单元格 | 是 |
| NotebookRead | 读取和显示 Jupyter notebook 内容 | 否 |
| Read | 读取文件内容 | 否 |
| Task | 运行子代理来处理复杂的多步骤任务 | 否 |
| TodoWrite | 创建和管理结构化任务列表 | 否 |
| WebFetch | 从指定 URL 获取内容 | 是 |
| WebSearch | 执行带有域过滤的网络搜索 | 是 |
| Write | 创建或覆盖文件 | 是 |

---

## ⚡自定义命令

### 1.项目自建自定义命令

项目文件的.claude文件夹下新建commands文件夹后，新建的.md文件名字即为命令名字

例如有一个code_review.md文件，内容为：对比当前这个分支与main分支的差异，提出你的review意见，并且生成应用过后的更新文件；或者是  对比这个分支：`$ARGUMENTS`与main分支的差异，提出你的review意见，并且生成应用过后的更新文件     

(`$ARGUMENTS` 为占位符，可作为分支名称（变量）传入)
使用方法为/命令名字 传入参数（可选）

### 2.用户级别自定义命令

将commands文件夹移动至C/User/用户名/.claude文件夹下即可（前文的CLAUDE.md同位置）

---

## 📞Hook（自动执行）

### 1.项目建立Hook

.claude文件夹下建立setting.json或·setting.local.json（更高权限）

例如以下这个自动修复 markdown 文件中缺失的语言标签和格式问题（适合编写我们的博客文件后检查）

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/markdown_formatter.py"
          }
        ]
      }
    ]
  }
}
```

Hook调用时机：

- **PreToolUse**：在工具调用之前运行（可以阻止它们）
- **PostToolUse**：在工具调用完成后运行
- **UserPromptSubmit**：当用户提交提示时运行，在 Claude 处理之前
- **Notification**：当 Claude Code 发送通知时运行
- **Stop**：当 Claude Code 完成响应时运行
- **SubagentStop**：当子代理任务完成时运行
- **PreCompact**：在 Claude Code 即将运行压缩操作之前运行
- **SessionStart**：当 Claude Code 开始新会话或恢复现有会话时运行
- **SessionEnd**：当 Claude Code 会话结束时运行

---

## 🛠️Sub Agent（子智能体并行执行）

使用方法：/agents 后选择是适用于项目还是用户级别

填写对应的描述以及结果（类似于我们的模型系统提示词）

使用这个的好处是可以将任务拆分为多个小任务，并且获得独属于每个确认子任务的精简上下文，不被上下文污染，效率与准确度更棒！

---

## 🚥代码回退（依靠额外插件，但强烈支持）

下载Github开源项目ccundo

[GitHub - RonitSachdev/ccundo: ccundo seamlessly integrates with Claude Code to provide granular undo functionality. It reads directly from Claude Code's session files to track file operations and allows you to selectively revert changes with full preview and cascading safety.](https://github.com/RonitSachdev/ccundo)

安装命令

```bash
npm install -g ccundo
```

使用：

`ccundo list` 列出对话记录

`ccundo undo 编号` 即可回退该对话的代码

---

## 🌐可视化版本推荐

[Github项目opcode](https://github.com/winfunc/opcode)