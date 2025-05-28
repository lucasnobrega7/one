#!/usr/bin/env tsx

/**
 * DNS Diagnostic Script
 * Verifica configuração DNS e encontra URLs do cPanel
 */

import { promises as dns } from 'dns';

interface DNSResult {
  domain: string;
  type: string;
  records: string[];
  error?: string;
}

interface CPanelTest {
  url: string;
  accessible: boolean;
  status?: number;
  error?: string;
}

async function checkDNS(domain: string, type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT'): Promise<DNSResult> {
  try {
    let records: string[] = [];
    
    switch (type) {
      case 'A':
        records = await dns.resolve4(domain);
        break;
      case 'AAAA':
        records = await dns.resolve6(domain);
        break;
      case 'CNAME':
        records = await dns.resolveCname(domain);
        break;
      case 'MX':
        const mxRecords = await dns.resolveMx(domain);
        records = mxRecords.map(mx => `${mx.priority} ${mx.exchange}`);
        break;
      case 'TXT':
        const txtRecords = await dns.resolveTxt(domain);
        records = txtRecords.map(txt => txt.join(''));
        break;
    }
    
    return {
      domain,
      type,
      records
    };
  } catch (error) {
    return {
      domain,
      type,
      records: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function testCPanelAccess(baseUrl: string): Promise<CPanelTest> {
  const testUrls = [
    `${baseUrl}:2083`,
    `${baseUrl}:2087`, 
    `${baseUrl}:2095`,
    `${baseUrl}:2096`,
    `${baseUrl}/cpanel`,
    `${baseUrl}/2083`,
    baseUrl
  ];
  
  for (const url of testUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.status < 500) {
        return {
          url,
          accessible: true,
          status: response.status
        };
      }
    } catch (error) {
      // Continue trying other URLs
    }
  }
  
  return {
    url: baseUrl,
    accessible: false,
    error: 'No accessible cPanel URL found'
  };
}

async function main() {
  console.log('🔍 DNS & cPanel Diagnostic Tool');
  console.log('=' .repeat(50));
  
  const domain = 'agentesdeconversao.ai';
  const subdomains = ['lp', 'dash', 'api', 'docs', 'login', 'cpanel', 'mail'];
  const recordTypes: ('A' | 'CNAME' | 'MX' | 'TXT')[] = ['A', 'CNAME', 'MX', 'TXT'];
  
  // 1. Verificar DNS do domínio principal
  console.log(`🌐 Verificando DNS de ${domain}...`);
  
  for (const type of recordTypes) {
    const result = await checkDNS(domain, type);
    if (result.records.length > 0) {
      console.log(`   ${type}: ${result.records.join(', ')}`);
    } else if (result.error && !result.error.includes('ENOTFOUND')) {
      console.log(`   ${type}: ❌ ${result.error}`);
    }
  }
  
  console.log();
  
  // 2. Verificar subdomínios
  console.log('🔗 Verificando subdomínios...');
  
  for (const sub of subdomains) {
    const fullDomain = `${sub}.${domain}`;
    const aResult = await checkDNS(fullDomain, 'A');
    const cnameResult = await checkDNS(fullDomain, 'CNAME');
    
    if (aResult.records.length > 0) {
      console.log(`   ✅ ${fullDomain} → ${aResult.records[0]} (A)`);
    } else if (cnameResult.records.length > 0) {
      console.log(`   ✅ ${fullDomain} → ${cnameResult.records[0]} (CNAME)`);
    } else {
      console.log(`   ❌ ${fullDomain} (não configurado)`);
    }
  }
  
  console.log();
  
  // 3. Encontrar cPanel
  console.log('🔧 Procurando cPanel...');
  
  const possibleCPanelHosts = [
    `https://${domain}`,
    `https://cpanel.${domain}`,
    `https://mail.${domain}`,
    `https://server.${domain}`,
    `https://hosting.${domain}`
  ];
  
  // Verificar IPs do domínio principal para testar cPanel
  const aResult = await checkDNS(domain, 'A');
  if (aResult.records.length > 0) {
    possibleCPanelHosts.push(`https://${aResult.records[0]}`);
  }
  
  for (const host of possibleCPanelHosts) {
    const result = await testCPanelAccess(host);
    if (result.accessible) {
      console.log(`   ✅ cPanel encontrado: ${result.url} (${result.status})`);
    } else {
      console.log(`   ❌ ${host} (não acessível)`);
    }
  }
  
  console.log();
  
  // 4. Testar resolução dos domínios problemáticos
  console.log('🚨 Testando domínios problemáticos...');
  
  const problemDomains = [
    'one-2wow7l0ne-agentesdeconversao.vercel.app',
    'lp.agentesdeconversao.ai',
    'agentesdeconversao.ai'
  ];
  
  for (const testDomain of problemDomains) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`https://${testDomain}`, {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const statusIcon = response.ok ? '✅' : '⚠️';
      console.log(`   ${statusIcon} ${testDomain} (${response.status})`);
      
      // Verificar redirecionamentos
      if (response.url !== `https://${testDomain}/`) {
        console.log(`      🔄 Redireciona para: ${response.url}`);
      }
      
    } catch (error) {
      console.log(`   ❌ ${testDomain} (${error})`);
    }
  }
  
  console.log();
  
  // 5. Sugestões de correção
  console.log('💡 Sugestões de correção:');
  console.log();
  
  // Verificar se subdomínios necessários existem
  const missingSubdomains = [];
  for (const sub of ['lp', 'dash', 'api']) {
    const fullDomain = `${sub}.${domain}`;
    const aResult = await checkDNS(fullDomain, 'A');
    const cnameResult = await checkDNS(fullDomain, 'CNAME');
    
    if (aResult.records.length === 0 && cnameResult.records.length === 0) {
      missingSubdomains.push(sub);
    }
  }
  
  if (missingSubdomains.length > 0) {
    console.log('🔧 Subdomínios faltantes (criar registros CNAME):');
    missingSubdomains.forEach(sub => {
      console.log(`   ${sub}.agentesdeconversao.ai → cname.vercel-dns.com`);
    });
    console.log();
  }
  
  console.log('📝 Configurações recomendadas no registrador:');
  console.log('   A     @    → [IP do servidor]');
  console.log('   CNAME lp   → cname.vercel-dns.com');
  console.log('   CNAME dash → cname.vercel-dns.com');
  console.log('   CNAME api  → cname.vercel-dns.com');
  console.log('   CNAME www  → agentesdeconversao.ai');
  console.log();
  
  console.log('🎯 Para corrigir o problema do botão "Começar agora":');
  console.log('   1. Configurar CNAME: lp.agentesdeconversao.ai → cname.vercel-dns.com');
  console.log('   2. No Vercel, adicionar domínio: lp.agentesdeconversao.ai');
  console.log('   3. Aguardar propagação DNS (1-48h)');
  console.log('   4. Testar: https://lp.agentesdeconversao.ai/');
}

// Função específica para encontrar cPanel
async function findCPanel() {
  console.log('🔍 Modo específico: Encontrar cPanel');
  console.log('=' .repeat(40));
  
  const domain = 'agentesdeconversao.ai';
  
  // Verificar portas comuns do cPanel
  const ports = [2083, 2087, 2095, 2096, 443, 80];
  const protocols = ['https', 'http'];
  
  console.log('🔌 Testando portas do cPanel...');
  
  for (const protocol of protocols) {
    for (const port of ports) {
      const url = `${protocol}://${domain}:${port}`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.status < 500) {
          console.log(`   ✅ ${url} (${response.status})`);
          
          // Tentar acessar login do cPanel
          try {
            const loginResponse = await fetch(`${url}/login`, {
              method: 'HEAD',
              signal: AbortSignal.timeout(3000)
            });
            if (loginResponse.status < 500) {
              console.log(`      🔑 Login cPanel: ${url}/login`);
            }
          } catch {}
        }
      } catch {
        // Porta não acessível
      }
    }
  }
}

// CLI
const command = process.argv[2];

if (command === 'cpanel' || command === 'find-cpanel') {
  findCPanel().catch(console.error);
} else {
  main().catch(console.error);
}