#!/usr/bin/env node
/**
 * IndexNow 调试测试脚本
 * 用于诊断 JSON 解析错误
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const INDEXNOW_KEY = '751fa2696f5b4f5890799ca542b34fbb';
const SITE_URL = 'https://www.micostar.tech';

/**
 * 测试单个端点
 */
async function testEndpoint(endpoint, urls) {
  console.log(`\n🔍 Testing endpoint: ${endpoint}`);
  
  const indexNowRequest = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls.slice(0, 5) // 只测试前5个URL
  };

  try {
    console.log(`  📤 Sending request with ${indexNowRequest.urlList.length} URLs...`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(indexNowRequest)
    });

    console.log(`  📊 Response status: ${response.status} ${response.statusText}`);
    console.log(`  📋 Content-Type: ${response.headers.get('content-type') || 'Not specified'}`);
    console.log(`  📏 Content-Length: ${response.headers.get('content-length') || 'Not specified'}`);

    // 尝试读取响应文本
    const responseText = await response.text();
    console.log(`  📄 Response body length: ${responseText.length} characters`);
    
    if (responseText.trim()) {
      console.log(`  📝 Response body: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
      
      // 尝试解析为 JSON
      try {
        const jsonResult = JSON.parse(responseText);
        console.log(`  ✅ Valid JSON response`);
      } catch (jsonError) {
        console.log(`  ❌ Invalid JSON: ${jsonError.message}`);
      }
    } else {
      console.log(`  ℹ️  Empty response body (this is normal for IndexNow)`);
    }

    return {
      endpoint,
      status: response.status,
      success: response.ok,
      hasBody: responseText.length > 0,
      contentType: response.headers.get('content-type')
    };

  } catch (error) {
    console.log(`  💥 Network error: ${error.message}`);
    return {
      endpoint,
      status: 0,
      success: false,
      error: error.message
    };
  }
}

/**
 * 主测试函数
 */
async function main() {
  try {
    console.log('🚀 Starting IndexNow diagnostic test...');
    
    // 生成测试URL列表
    const testUrls = [
      SITE_URL,
      `${SITE_URL}/about/`,
      `${SITE_URL}/apps/`,
      `${SITE_URL}/archive/`,
      `${SITE_URL}/rss.xml`
    ];

    console.log(`📋 Testing with ${testUrls.length} URLs:`);
    testUrls.forEach(url => console.log(`  - ${url}`));

    // 测试所有端点
    const indexNowEndpoints = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow',
      'https://yandex.com/indexnow'
    ];

    const results = [];
    for (const endpoint of indexNowEndpoints) {
      const result = await testEndpoint(endpoint, testUrls);
      results.push(result);
      
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 输出总结
    console.log('\n📊 Test Summary:');
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`  ${status} ${new URL(result.endpoint).hostname}: HTTP ${result.status}`);
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });

    const successful = results.filter(r => r.success).length;
    console.log(`\n🎯 Result: ${successful}/${results.length} endpoints successful`);
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }
}

// 运行测试
main();