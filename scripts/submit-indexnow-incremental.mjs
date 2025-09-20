import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SUBMITTED_URLS_FILE = join(process.cwd(), '.indexnow-submitted.json');

// 读取已提交的URL记录
function getSubmittedUrls() {
  if (!existsSync(SUBMITTED_URLS_FILE)) {
    return {
      urls: [],
      lastSubmitted: null,
      totalSubmissions: 0
    };
  }
  
  try {
    const data = readFileSync(SUBMITTED_URLS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('⚠️ 无法读取已提交URL记录，将重新开始:', error.message);
    return {
      urls: [],
      lastSubmitted: null,
      totalSubmissions: 0
    };
  }
}

// 保存已提交的URL记录
function saveSubmittedUrls(submittedData) {
  try {
    writeFileSync(SUBMITTED_URLS_FILE, JSON.stringify(submittedData, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ 保存已提交URL记录失败:', error.message);
  }
}

// 增量提交到IndexNow
async function submitIncrementalIndexNow() {
  try {
    // 读取构建后的 sitemap
    const sitemapPath = join(process.cwd(), 'dist', 'sitemap-0.xml');
    
    if (!existsSync(sitemapPath)) {
      console.error('❌ 未找到 sitemap 文件，请先运行 pnpm build');
      process.exit(1);
    }
    
    const sitemapContent = readFileSync(sitemapPath, 'utf-8');
    
    // 从 sitemap 中提取 URL
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    const currentUrls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];
    
    if (currentUrls.length === 0) {
      console.error('❌ 未找到要提交的 URL');
      process.exit(1);
    }

    console.log(`📋 当前网站共有 ${currentUrls.length} 个页面`);

    // 获取已提交的URL记录
    const submittedData = getSubmittedUrls();
    const submittedUrls = new Set(submittedData.urls || []);

    // 找出新增的URL
    const newUrls = currentUrls.filter(url => !submittedUrls.has(url));
    
    if (newUrls.length === 0) {
      console.log('✅ 没有新增URL需要提交到 IndexNow');
      console.log(`📊 统计信息:`);
      console.log(`   - 总页面数: ${currentUrls.length}`);
      console.log(`   - 已提交数: ${submittedUrls.size}`);
      console.log(`   - 上次提交: ${submittedData.lastSubmitted || '从未提交'}`);
      console.log(`   - 提交次数: ${submittedData.totalSubmissions || 0}`);
      return;
    }

    console.log(`🚀 发现 ${newUrls.length} 个新增URL需要提交:`);
    newUrls.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });

    // IndexNow 官方配置
    const key = '751fa2696f5b4f5890799ca542b34fbb';
    const host = 'micostar.tech';
    const keyLocation = 'https://micostar.tech/751fa2696f5b4f5890799ca542b34fbb.txt';

    const payload = {
      host,
      key,
      keyLocation,
      urlList: newUrls
    };

    // 提交到 IndexNow 官方 API
    console.log('🔄 正在提交新增URL到 api.indexnow.org...');
    
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'Micostar-Blog-IndexNow/1.0'
      },
      body: JSON.stringify(payload)
    });

    // IndexNow API 通常返回空响应体
    let responseBody = '';
    try {
      responseBody = await response.text();
    } catch (e) {
      // 正常情况，IndexNow通常返回空响应
    }

    const isSuccess = response.status === 200 || response.status === 202;

    if (isSuccess) {
      console.log(`✅ IndexNow 提交成功! (HTTP ${response.status})`);
      
      // 更新已提交URL记录
      const updatedSubmittedData = {
        urls: [...submittedUrls, ...newUrls],
        lastSubmitted: new Date().toISOString(),
        totalSubmissions: (submittedData.totalSubmissions || 0) + 1,
        lastSubmissionDetails: {
          newUrlsCount: newUrls.length,
          totalUrlsCount: currentUrls.length,
          timestamp: new Date().toISOString(),
          status: response.status,
          newUrls: newUrls
        }
      };
      
      saveSubmittedUrls(updatedSubmittedData);
      
      console.log(`📊 提交统计:`);
      console.log(`   - 本次新增: ${newUrls.length} 个URL`);
      console.log(`   - 累计提交: ${updatedSubmittedData.urls.length} 个URL`);
      console.log(`   - 提交次数: ${updatedSubmittedData.totalSubmissions}`);
      console.log(`   - 节省额度: ${currentUrls.length - newUrls.length} 个URL (${Math.round((1 - newUrls.length / currentUrls.length) * 100)}%)`);
      
    } else {
      console.error(`❌ IndexNow 提交失败: HTTP ${response.status} ${response.statusText}`);
      if (responseBody) {
        console.error('响应内容:', responseBody);
      }
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ 提交过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 强制重新提交所有URL的选项
async function forceSubmitAll() {
  try {
    console.log('🔄 强制提交模式：将提交所有URL...');
    
    // 读取构建后的 sitemap
    const sitemapPath = join(process.cwd(), 'dist', 'sitemap-0.xml');
    const sitemapContent = readFileSync(sitemapPath, 'utf-8');
    
    // 从 sitemap 中提取 URL
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    const urls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];
    
    console.log(`📋 准备提交所有 ${urls.length} 个 URL`);

    // IndexNow 官方配置
    const key = '751fa2696f5b4f5890799ca542b34fbb';
    const host = 'micostar.tech';
    const keyLocation = 'https://micostar.tech/751fa2696f5b4f5890799ca542b34fbb.txt';

    const payload = {
      host,
      key,
      keyLocation,
      urlList: urls
    };

    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'Micostar-Blog-IndexNow/1.0'
      },
      body: JSON.stringify(payload)
    });

    const isSuccess = response.status === 200 || response.status === 202;

    if (isSuccess) {
      console.log(`✅ 强制提交成功! (HTTP ${response.status})`);
      
      // 重置记录
      const submittedData = {
        urls: urls,
        lastSubmitted: new Date().toISOString(),
        totalSubmissions: 1,
        lastSubmissionDetails: {
          newUrlsCount: urls.length,
          totalUrlsCount: urls.length,
          timestamp: new Date().toISOString(),
          status: response.status,
          forcedSubmission: true
        }
      };
      
      saveSubmittedUrls(submittedData);
      
    } else {
      console.error(`❌ 强制提交失败: HTTP ${response.status}`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ 强制提交失败:', error.message);
    process.exit(1);
  }
}

// 查看提交状态
function showStatus() {
  const submittedData = getSubmittedUrls();
  
  console.log('📊 IndexNow 提交状态:');
  console.log(`   - 已提交URL数量: ${submittedData.urls?.length || 0}`);
  console.log(`   - 上次提交时间: ${submittedData.lastSubmitted || '从未提交'}`);
  console.log(`   - 总提交次数: ${submittedData.totalSubmissions || 0}`);
  
  if (submittedData.lastSubmissionDetails) {
    const details = submittedData.lastSubmissionDetails;
    console.log(`   - 上次提交详情:`);
    console.log(`     • 新增URL数: ${details.newUrlsCount}`);
    console.log(`     • 总URL数: ${details.totalUrlsCount}`);
    console.log(`     • 响应状态: ${details.status}`);
    console.log(`     • 是否强制提交: ${details.forcedSubmission ? '是' : '否'}`);
  }
}

// 清除提交记录
function clearStatus() {
  if (existsSync(SUBMITTED_URLS_FILE)) {
    writeFileSync(SUBMITTED_URLS_FILE, JSON.stringify({
      urls: [],
      lastSubmitted: null,
      totalSubmissions: 0
    }, null, 2));
    console.log('✅ 已清除IndexNow提交记录');
  } else {
    console.log('ℹ️ 没有找到提交记录文件');
  }
}

// 命令行参数处理
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case '--force':
  case '-f':
    forceSubmitAll();
    break;
  case '--status':
  case '-s':
    showStatus();
    break;
  case '--clear':
  case '-c':
    clearStatus();
    break;
  case '--help':
  case '-h':
    console.log('IndexNow 增量提交工具');
    console.log('');
    console.log('用法:');
    console.log('  pnpm submit-indexnow-incremental          # 增量提交新增URL');
    console.log('  pnpm submit-indexnow-incremental --force  # 强制提交所有URL');
    console.log('  pnpm submit-indexnow-incremental --status # 查看提交状态');
    console.log('  pnpm submit-indexnow-incremental --clear  # 清除提交记录');
    console.log('  pnpm submit-indexnow-incremental --help   # 显示帮助');
    break;
  default:
    submitIncrementalIndexNow();
    break;
}