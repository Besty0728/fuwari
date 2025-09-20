#!/usr/bin/env node
/**
 * IndexNow 自动提交脚本
 * 用于在构建完成后自动提交所有 URL 到搜索引擎
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const INDEXNOW_KEY = '751fa2696f5b4f5890799ca542b34fbb';
const SITE_URL = 'https://www.micostar.tech';

/**
 * 从 sitemap 中提取所有 URL
 */
function extractUrlsFromSitemap(sitemapPath) {
  if (!existsSync(sitemapPath)) {
    console.warn(`Sitemap not found at ${sitemapPath}`);
    return [];
  }

  const sitemapContent = readFileSync(sitemapPath, 'utf-8');
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;

  while ((match = urlRegex.exec(sitemapContent)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

/**
 * 生成基本页面 URL
 */
function generateBasicUrls() {
  return [
    SITE_URL,
    `${SITE_URL}/about/`,
    `${SITE_URL}/apps/`,
    `${SITE_URL}/donate/`,
    `${SITE_URL}/archive/`,
    `${SITE_URL}/rss.xml`,
    `${SITE_URL}/sitemap-index.xml`
  ];
}

/**
 * 向 IndexNow API 提交 URL
 */
async function submitToIndexNow(urls) {
  const indexNowRequest = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls
  };

  const indexNowEndpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
  ];

  console.log(`📤 Submitting ${urls.length} URLs to IndexNow...`);
  
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

        // IndexNow API 通常返回空响应体，只需要检查状态码
        return {
          endpoint,
          status: response.status,
          success: response.ok,
          statusText: response.statusText || 'No message'
        };
      } catch (error) {
        return {
          endpoint,
          status: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    })
  );

  // 输出结果
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { endpoint, status, success, statusText } = result.value;
      const endpointName = new URL(endpoint).hostname;
      
      if (success) {
        console.log(`✅ ${endpointName}: HTTP ${status} - Success`);
      } else {
        console.log(`❌ ${endpointName}: HTTP ${status} - ${statusText}`);
      }
    } else {
      console.log(`💥 Request failed: ${result.reason}`);
    }
  });

  const successful = results.filter(result => 
    result.status === 'fulfilled' && result.value.success
  ).length;

  console.log(`\n📊 Summary: ${successful}/${indexNowEndpoints.length} endpoints successful`);
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 Starting IndexNow submission process...');
    
    // 尝试从构建输出的 sitemap 中获取 URL
    const distPath = join(process.cwd(), 'dist');
    const sitemapPath = join(distPath, 'sitemap-0.xml');
    
    let urls = [];
    
    // 首先从 sitemap 获取 URL
    if (existsSync(sitemapPath)) {
      urls = extractUrlsFromSitemap(sitemapPath);
      console.log(`📋 Found ${urls.length} URLs from sitemap`);
    } else {
      // 如果没有 sitemap，使用基本 URL
      urls = generateBasicUrls();
      console.log(`📋 Using ${urls.length} basic URLs (sitemap not found)`);
    }

    if (urls.length === 0) {
      console.log('⚠️  No URLs to submit');
      return;
    }

    // 提交到 IndexNow
    await submitToIndexNow(urls);
    
    console.log('✨ IndexNow submission completed!');
    
  } catch (error) {
    console.error('💥 IndexNow submission failed:', error);
    process.exit(1);
  }
}

// 运行主函数
main();