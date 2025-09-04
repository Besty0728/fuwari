---
title: Unity调用OpenWeatherAPI查询天气
published: 2025-07-24T01:03:07.000Z
updated: 2025-07-26T07:34:39.000Z
description: 查询天气（实时）
image: '/uploads/images/image-1753347365939-458403350.png'
tags: [Unity, 网络API]
lang: ""
---

<h1><!-- [if !supportLists]--><span style="mso-list: Ignore;">1.&nbsp;</span><!--[endif]--><strong><span style="font-family: 宋体;">准备资源</span></strong></h1>
<p class="MsoNormal"><!-- [if !supportLists]--><span style="mso-list: Ignore;">A.&nbsp;</span><!--[endif]--><span style="font-family: 宋体;">网站官方：</span><a href="https://openweathermap.org/"><u><span style="font-family: Calibri;">https://openweathermap.org/</span></u></a>&nbsp;&nbsp;&nbsp;<span style="font-family: Calibri;">(</span><span style="font-family: 宋体;">创建账户，获得免费</span><span style="font-family: Calibri;">API Key)</span></p>
<p class="MsoNormal"><!-- [if !supportLists]--><span style="mso-list: Ignore;">B.&nbsp;</span><!--[endif]--><span style="font-family: 宋体;">网站</span><span style="font-family: Calibri;">API</span><span style="font-family: 宋体;">文档调用示例：</span><a href="https://openweathermap.org/current"><u><span class="15"><span style="font-family: 宋体;">当前天气数据</span> - OpenWeatherMap</span></u></a></p>
<p class="MsoNormal"><!-- [if !supportLists]--><span style="mso-list: Ignore;">C.&nbsp;</span><!--[endif]--><span style="font-family: 宋体;">网站地理编码</span><span style="font-family: Calibri;">API</span><span style="font-family: 宋体;">文档示例：</span><a href="https://openweathermap.org/api/geocoding-api"><u><span class="15"><span style="font-family: 宋体;">地理编码</span> API - OpenWeatherMap</span></u></a></p>
<p class="MsoNormal"><!-- [if !supportLists]--><span style="mso-list: Ignore;">D.&nbsp;</span><!--[endif]--><span style="font-family: 宋体;">网站天气图标获取</span><span style="font-family: Calibri;">(</span><span style="font-family: 宋体;">采用</span><span style="font-family: Calibri;">F12</span><span style="font-family: 宋体;">检查台来获取源图片</span><span style="font-family: Calibri;">)</span><span style="font-family: 宋体;">：</span><a href="#How-to-get-icon-URL"><u><span class="15"><span style="font-family: 宋体;">天气状况</span> - OpenWeatherMap</span></u></a></p>
<h1><span style="mso-list: Ignore;">2. 界面搭建</span><!--[endif]--></h1>
<p><span style="mso-list: Ignore;"><img src="/uploads/images/image-1753347351824-766386576.png" alt=""></span></p>
<p><span style="mso-list: Ignore;"><img src="/uploads/images/image-1753347365939-458403350.png" alt=""></span></p>
<h1><span style="mso-list: Ignore;">3.&nbsp;</span><!--[endif]--><strong><span style="font-family: 宋体;">编写详细脚本</span></strong></h1>
<p class="MsoNormal"><span style="font-family: 宋体;">A.创建按钮与输入框，检查事件</span><span style="font-family: Calibri;">/</span><span style="font-family: 宋体;">监听事件</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347438843-50591915.png" alt=""></span></p>
<p class="MsoNormal"><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347452518-259337095.png" alt="" width="468" height="28"></span></p>
<p class="MsoNormal"><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347467202-834195448.png" alt=""></span></p>
<p class="MsoNormal"><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347479053-641590858.png" alt=""></span></p>
<p class="MsoNormal"><span style="font-family: Calibri;">B.</span><span style="font-family: 宋体;">创建天气图标加载，采用字典，从持久化文件夹的一个文件夹中加载该图标集合</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347500126-612710467.png" alt=""></span></p>
<p class="MsoNormal"><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347511105-915289023.png" alt=""></span></p>
<p class="MsoNormal"><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347523858-994668070.png" alt=""></span></p>
<p class="MsoNormal"><span style="font-family: Calibri;">C.</span><span style="font-family: 宋体;">创建协程，进行网络查询请求</span><span style="font-family: Calibri;">(Get Post)</span></p>
<p class="MsoNormal"><span style="font-family: Calibri;"><img src="/uploads/images/image-1753347553329-184317497.png" alt="" width="808" height="127"></span></p>
<p class="MsoNormal"><span style="font-family: Calibri;"><img src="/uploads/images/image-1753347572391-956391829.png" alt=""></span></p>
<p class="MsoNormal"><span style="font-family: 宋体;">D.此处要深度对照</span><span style="font-family: Calibri;">API</span><span style="font-family: 宋体;">文档实例的各项数据</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;">例如：</span><span style="font-family: Calibri;">geturl</span><span style="font-family: 宋体;">是对应地理编码</span><span style="font-family: Calibri;">API</span><span style="font-family: 宋体;">，这样才可以实现输入名称来查询，而不是对照编码查询</span></p>
<p class="MsoNormal"><span style="font-family: Calibri;">Varurl</span><span style="font-family: 宋体;">是对应当前天气数据的</span><span style="font-family: Calibri;">API(</span><span style="font-family: 宋体;">查询主力</span><span style="font-family: Calibri;">)</span></p>
<p class="MsoNormal"><span style="font-family: Calibri;">UnityWebRequest</span><span style="font-family: 宋体;">是</span><span style="font-family: Calibri;">Unity</span><span style="font-family: 宋体;">提供用于网络请求</span><span style="font-family: Calibri;">Http(s)</span><span style="font-family: 宋体;">的类，</span><span style="font-family: Calibri;">SendWebRequest</span><span style="font-family: 宋体;">是发送网络请求</span></p>
<p class="MsoNormal"><span style="font-family: Calibri;">GetJsonYN</span><span style="font-family: 宋体;">是下面的一个统一处理方法</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347599242-521568104.png" alt=""></span></p>
<p class="MsoNormal"><span style="font-family: 宋体;">E.更新文本</span><span style="font-family: Calibri;">UI</span><strong><u><span style="font-family: 宋体;">绝对的对照</span><span style="font-family: Calibri;">Json</span><span style="font-family: 宋体;">文件</span></u></strong></p>
<p class="MsoNormal"><strong><u><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347644717-22499377.png" alt=""></span></u></strong></p>
<p class="MsoNormal"><strong><u><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347661716-939041786.png" alt=""></span></u></strong></p>
<p class="MsoNormal"><span style="font-family: Calibri;">Cache</span><span style="font-family: 宋体;">为上文创建的字典</span></p>
<p class="MsoNormal"><span style="mso-list: Ignore;">F.&nbsp;</span><!--[endif]--><span style="font-family: 宋体;">风向选择解析</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;">内部包含</span><span style="font-family: Calibri;">16</span><span style="font-family: 宋体;">方向</span><span style="font-family: Calibri;">360/16=22.5</span><span style="font-family: 宋体;">，按照索引排序选择对应风向</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;">这是将角度转换为数组索引的核心计算。</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;">degrees + 11.25</span><span style="font-family: 宋体;">: 将角度偏移半个区间 (22.5 / 2 = 11.25)。这样做是为了让每个风向区间的中心对齐。例如，0度（正北）应该落在 "北风" 区间。加上11.25后，0度就变成了11.25，除以22.5是0.5，取整后是0，对应 "北风"。22.5度（东北偏北和东北的边界）加上11.25是33.75，除以22.5是1.5，取整后是1，对应 "东北偏北风"。</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;">/ 22.5</span><span style="font-family: 宋体;">: 将调整后的角度除以每个风向区间的宽度，得到一个浮点数索引。</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;">(int)(...)</span><span style="font-family: 宋体;">: 将结果转换为整数，截断小数部分，得到初步的索引。</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;">% 16</span><span style="font-family: 宋体;">: 取模16，确保索引值始终在 0 到 15 之间，以对应 </span><span style="font-family: 宋体;">directions</span>&nbsp;<span style="font-family: 宋体;">数组的有效索引范围。例如，</span><span style="font-family: 宋体;">360度（等同于0度）经过计算后也能正确映射到 "北风"。</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;">return directions[index];</span><span style="font-family: 宋体;">: 使用计算得到的 </span><span style="font-family: 宋体;">index</span>&nbsp;<span style="font-family: 宋体;">从</span> <span style="font-family: 宋体;">directions</span>&nbsp;<span style="font-family: 宋体;">数组中取出对应的风向字符串并返回。</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347697499-969070799.png" alt=""></span></p>
<p class="MsoNormal"><span style="font-family: Calibri;">G.</span><span style="font-family: 宋体;">挂载脚本</span></p>
<p class="MsoNormal"><span style="font-family: 宋体;"><img src="/uploads/images/image-1753347718981-523560948.png" alt=""></span></p>
<p class="MsoNormal"><strong><span style="font-family: 宋体;">源脚本见&ldquo;资源分享&rdquo;--网络API（OpenWether）</span></strong></p>