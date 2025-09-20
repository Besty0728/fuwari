import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const INDEXNOW_KEY = '751fa2696f5b4f5890799ca542b34fbb';

interface IndexNowRequest {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const siteUrl = 'https://www.micostar.tech';
    
    // 获取所有已发布的博客文章
    const posts = await getCollection('posts', ({ data }) => !data.draft);
    
    // 生成所有需要索引的 URL
    const urlList: string[] = [
      // 主要页面
      siteUrl,
      `${siteUrl}/about/`,
      `${siteUrl}/apps/`,
      `${siteUrl}/donate/`,
      `${siteUrl}/archive/`,
      
      // 博客文章页面
      ...posts.map(post => `${siteUrl}/posts/${post.slug}/`),
      
      // 分页页面
      `${siteUrl}/page/1/`,
      
      // RSS 和 sitemap
      `${siteUrl}/rss.xml`,
      `${siteUrl}/sitemap-index.xml`,
    ];

    // 构造 IndexNow 请求体
    const indexNowRequest: IndexNowRequest = {
      host: new URL(siteUrl).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
      urlList: urlList
    };

    // 发送到多个搜索引擎的 IndexNow 端点
    const indexNowEndpoints = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow',
      'https://yandex.com/indexnow'
    ];

    const results = await Promise.allSettled(
      indexNowEndpoints.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(indexNowRequest)
          });

          return {
            endpoint,
            status: response.status,
            success: response.ok,
            statusText: response.statusText || 'No message'
          };
        } catch (error) {
          console.error(`IndexNow request failed for ${endpoint}:`, error);
          return {
            endpoint,
            status: 0,
            success: false,
            error: error instanceof Error ? error.message : 'Network error'
          };
        }
      })
    );

    // 统计结果
    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;

    return new Response(JSON.stringify({
      success: true,
      totalUrls: urlList.length,
      submittedTo: indexNowEndpoints.length,
      successful: successful,
      results: results.map(result => 
        result.status === 'fulfilled' ? result.value : { error: result.reason }
      ),
      urls: urlList
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('IndexNow submission error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'IndexNow API endpoint. Use POST to submit URLs.',
    key: INDEXNOW_KEY,
    keyLocation: `https://www.micostar.tech/${INDEXNOW_KEY}.txt`
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};