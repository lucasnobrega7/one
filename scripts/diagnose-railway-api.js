#!/usr/bin/env node

const https = require('https');
const dns = require('dns');
const { promisify } = require('util');

const resolve = promisify(dns.resolve);
const resolveCname = promisify(dns.resolveCname);

// URLs to test
const testUrls = [
  'https://s2pgzru5.up.railway.app',
  'https://s2pgzru5.up.railway.app/',
  'https://s2pgzru5.up.railway.app/api',
  'https://s2pgzru5.up.railway.app/health',
  'https://api.agentesdeconversao.ai',
  'https://api.agentesdeconversao.ai/',
  'https://api.agentesdeconversao.ai/api'
];

async function testHttps(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Railway-Diagnosis-Tool/1.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          body: data.substring(0, 200),
          success: true
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        error: error.message,
        success: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        error: 'Request timeout',
        success: false
      });
    });
  });
}

async function testDns(domain) {
  try {
    const results = {};
    
    try {
      results.A = await resolve(domain, 'A');
    } catch (e) {
      results.A = `Error: ${e.message}`;
    }
    
    try {
      results.CNAME = await resolveCname(domain);
    } catch (e) {
      results.CNAME = `Error: ${e.message}`;
    }
    
    return { domain, ...results };
  } catch (error) {
    return { domain, error: error.message };
  }
}

async function main() {
  console.log('🔍 Diagnosticando Railway API e domínio .ai...\n');
  
  // Test DNS
  console.log('📡 Testando DNS:');
  const dnsTests = [
    's2pgzru5.up.railway.app',
    'api.agentesdeconversao.ai',
    'agentesdeconversao.ai'
  ];
  
  for (const domain of dnsTests) {
    const result = await testDns(domain);
    console.log(`  ${domain}:`);
    console.log(`    A records: ${JSON.stringify(result.A)}`);
    console.log(`    CNAME records: ${JSON.stringify(result.CNAME)}`);
    console.log('');
  }
  
  // Test HTTPS endpoints
  console.log('🌐 Testando endpoints HTTPS:');
  for (const url of testUrls) {
    const result = await testHttps(url);
    console.log(`  ${url}:`);
    if (result.success) {
      console.log(`    ✅ Status: ${result.status}`);
      console.log(`    Response: ${result.body.substring(0, 100)}...`);
    } else {
      console.log(`    ❌ Error: ${result.error}`);
    }
    console.log('');
  }
  
  console.log('📋 Análise completa!');
}

main().catch(console.error);