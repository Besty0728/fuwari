import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('IndexNow API called - Method:', request.method);
    console.log('Headers:', [...request.headers.entries()]);
    
    // 记录请求信息但不实际提交到搜索引擎
    const userAgent = request.headers.get('User-Agent') || 'Unknown';
    const timestamp = new Date().toISOString();
    
    // 模拟成功响应
    const mockResponse = {
      success: true,
      message: 'Debug mode - requests not sent to search engines',
      timestamp,
      userAgent,
      totalUrls: 31, // 模拟数据
      submittedTo: 3,
      successful: 3,
      urls: ['https://example.com/debug'],
      results: [
        { 
          endpoint: 'https://api.indexnow.org/indexnow', 
          success: true, 
          status: 200,
          statusText: 'OK (Debug Mode)'
        },
        { 
          endpoint: 'https://bing.com/indexnow', 
          success: true, 
          status: 200,
          statusText: 'OK (Debug Mode)'
        },
        { 
          endpoint: 'https://yandex.com/indexnow', 
          success: true, 
          status: 200,
          statusText: 'OK (Debug Mode)'
        }
      ]
    };
    
    return new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('IndexNow API error:', error);
    
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};