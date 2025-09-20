import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('IndexNow API called');
    
    // 获取所有博客文章
    const posts = await getCollection('posts');
    
    // 构建要提交的 URL 列表
    const baseUrl = 'https://micostar.tech';
    const urls = [
      baseUrl, // 首页
      `${baseUrl}/archive`, // 归档页
      `${baseUrl}/about`, // 关于页
      ...posts.map(post => `${baseUrl}/posts/${post.slug}`) // 所有文章页面
    ];

    console.log(`Submitting ${urls.length} URLs to IndexNow`);

    // IndexNow 官方配置
    const key = '751fa2696f5b4f5890799ca542b34fbb';
    const host = 'micostar.tech';
    const keyLocation = `${baseUrl}/${key}.txt`;

    // 按照官方格式提交到 api.indexnow.org
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'Micostar-Blog-IndexNow/1.0'
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: urls
      })
    });

    console.log(`IndexNow response: ${response.status} ${response.statusText}`);
    
    // IndexNow API 通常返回 HTTP 200 (成功) 或 202 (已接受)
    const isSuccess = response.status === 200 || response.status === 202;
    
    let responseText = '';
    try {
      responseText = await response.text();
      console.log('IndexNow response body:', responseText);
    } catch (e) {
      console.log('No response body or failed to read response');
    }

    return new Response(JSON.stringify({
      success: isSuccess,
      message: isSuccess ? 'URLs submitted to IndexNow successfully' : `IndexNow submission failed: HTTP ${response.status}`,
      totalUrls: urls.length,
      status: response.status,
      statusText: response.statusText,
      responseBody: responseText,
      urls,
      endpoint: 'https://api.indexnow.org/IndexNow',
      submittedAt: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('IndexNow API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      endpoint: 'https://api.indexnow.org/IndexNow'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};