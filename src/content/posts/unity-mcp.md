---
title: Unity配置MCP实现自动化
published: 2025-08-12T08:45:29.000Z
updated: 2025-08-12T09:08:12.000Z
description: 配置UnityMCP实现AI接管你的Unity
image: '/uploads/images/unitymcp.png'
tags: [AI, MCP, Unity, 自动化]
lang: ""
---

<p>这里只介绍三种配置示例，不会的去看视频；链接：<a href="https://www.bilibili.com/video/BV1gqtozaE4G/?vd_source=2eb5b7bd2c2ae3d60105b79832451ecc">利用GithubCopilot实现Unity自动化（MCP）_哔哩哔哩_bilibili</a></p>
<p>VSCode傻瓜式一键即可</p>
<div>
<div>
<pre><code>{</code><br><code>  "servers": {</code><br><code>      "github": {</code><br><code>      "type":"http"</code><br><code>      "url":"https://api.githubcopilot.com/mcp</code><br><code>      "gallery":true</code><br><code>      },</code><br><code>      "unityMCP": {</code><br><code>          "command": "C:\\Users\\Betsy\\AppData\\Roaming\\Python\\Python313\\Scripts\\uv.exe",</code><br><code>          "args": [</code><br><code>              "--directory",</code><br><code>              "C:\\Users\\Betsy\\AppData\\Local\\Programs\\UnityMCP\\UnityMcpServer\\src",</code><br><code>              "run",</code><br><code>              "server.py"</code><br><code>          ],</code><br><code>          "type": "stdio"</code><br><code>      }</code><br><code>   },<br>   "inputs":[]</code><br><code>}</code></pre>
</div>
<div>Rider：（以上的GithubMCP可以选择不要,只要servers里包含我们的UnityMCP即可）</div>
<div>
<div>
<pre><code>{</code><br><code>  "servers": {</code><br><code>    "github": {</code><br><code>      "url": "https://api.githubcopilot.com/mcp/",</code><br><code>      "requestInit": {</code><br><code>        "headers": {</code><br><code>          "Authorization": "你的GithubPAT密钥"</code><br><code>        }</code><br><code>      }</code><br><code>    },</code><br><code>    "unityMCP": {</code><br><code>      "command": "C:\\Users\\Betsy\\AppData\\Roaming\\Python\\Python313\\Scripts\\uv.exe",</code><br><code>      "args": [</code><br><code>        "--directory",</code><br><code>        "C:\\Users\\Betsy\\AppData\\Local\\Programs\\UnityMCP\\UnityMcpServer\\src",</code><br><code>        "run",</code><br><code>        "server.py"</code><br><code>      ],</code><br><code>      "type": "stdio"</code><br><code>    }</code><br><code>  }</code><br><code>}</code></pre>
</div>
</div>
<div>Visual Studio：（这个是我最想喷的，官方给的mcp配置也是云里雾里的。。。目前最新版本是17.14，在你项目下面要建立一个<code>.mcp.json</code>文件才可以，<span style="color: #e03e2d;">重启才能生效！！！<span style="color: #000000;">）</span></span></div>
<div><span style="color: #e03e2d;"><span style="color: #000000;"><img src="/uploads/images/image-1755016952760-375474964.png"></span></span></div>
<div><span style="color: #e03e2d;"><span style="color: #000000;">VS配置直接复用VSCode的UnityMCP即可，GithubMCP要使用和Rider一样的PAT认证</span></span></div>
<div>
<pre><code>{</code><br><code>  "servers": {</code><br><code>    "github": {</code><br><code>      "url": "https://api.githubcopilot.com/mcp/",</code><br><code>      "authorization_token": "你的GithubPAT密钥"</code><br><code>    },<br>                 </code><br><code>    "unityMCP": {</code><br><code>      "command": "C:\\Users\\Betsy\\AppData\\Roaming\\Python\\Python313\\Scripts\\uv.exe",</code><br><code>      "args": [</code><br><code>        "--directory",</code><br><code>        "C:\\Users\\Betsy\\AppData\\Local\\Programs\\UnityMCP\\UnityMcpServer\\src",</code><br><code>        "run",</code><br><code>        "server.py"</code><br><code>        ],</code><br><code>        "type": "stdio"</code><br><code>      }</code><br><code>   },<br>   "inputs":[]</code><br><code>}</code></pre>
</div>
</div>