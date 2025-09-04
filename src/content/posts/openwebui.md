---
title: 关于OpenWebUI外部访问的细节错误
published: 2025-08-02T07:30:35.000Z
updated: 2025-08-02T07:33:55.000Z
description: OpenWebUI使用nginx来供外部访问的细节错误
image: '/uploads/images/openwebui.png'
tags: [AI, Openwebui, Nginx]
lang: ""
---

<p>关于这个错误：</p>
<h1 class="gh-header-title flex-auto wb-break-word f1 mr-0"><span class="js-issue-title markdown-title">SyntaxError： Unexpected token 'd'， &ldquo;data： {&rdquo;id&ldquo;...JSON 无效</span></h1>
<p><span class="js-issue-title markdown-title"><img src="/uploads/images/image-1754148558836-843256870.png"></span></p>
<p><span class="js-issue-title markdown-title">这个是因为你的服务没有开启websocket导致的，开启的地方主要有两处：</span></p>
<ol>
<li><span class="js-issue-title markdown-title">nginx没有开启websocket支持（添加我标注的蓝色部分即可）</span><br><img src="/uploads/images/image-1754148814476-105309073.png" alt="" width="1321" height="786"></li>
<li>你的域名服务商没有开启websocket支持（我个人踩过最深的坑）<br>以我使用的EdgeOne为例，EdgeOne默认不开启Websocket支持<br><img src="/uploads/images/image-1754148546904-319018769.png"><br>CloudFlare默认全部计划均开启且支持Websocket<br><img src="/uploads/images/image-1754148603332-270641179.png"></li>
</ol>