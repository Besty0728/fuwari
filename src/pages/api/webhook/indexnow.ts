import type { APIRoute } from 'astro';

const WEBHOOK_SECRET = 'indexnow-webhook-2024'; // 简单的验证密钥

export const POST: APIRoute = async ({ request }) => {
  try {
    // 简单的验证
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${WEBHOOK_SECRET}`;
    
    if (authHeader !== expectedAuth) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 调用内部 IndexNow API
    const baseUrl = new URL(request.url).origin;
    const indexNowResponse = await fetch(`${baseUrl}/api/indexnow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    let result;
    try {
      const responseText = await indexNowResponse.text();
      result = responseText ? JSON.parse(responseText) : { status: indexNowResponse.status };
    } catch (jsonError) {
      console.error('Failed to parse IndexNow API response:', jsonError);
      result = { 
        error: 'Invalid response format', 
        status: indexNowResponse.status,
        statusText: indexNowResponse.statusText
      };
    }

    return new Response(JSON.stringify({
      success: true,
      webhook: 'Vercel deployment triggered IndexNow submission',
      indexnow_result: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook IndexNow error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'IndexNow Webhook Endpoint',
    usage: 'POST with Authorization: Bearer indexnow-webhook-2024',
    note: 'This endpoint is called by Vercel deploy hooks'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};