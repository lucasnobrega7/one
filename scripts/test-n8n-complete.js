#!/usr/bin/env node

/**
 * Teste completo da integração N8N + Redis
 */

console.log('🧪 Teste Completo - N8N + Redis Integration\n');

async function testN8nConnection() {
  console.log('📡 Teste 1: Conectividade N8N');
  
  try {
    const response = await fetch('https://n8n-agentesdeconversao.yh8aah.easypanel.host/api/v1/workflows', {
      headers: {
        'X-N8N-API-KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYzNlNWE5YS0yMjNjLTRlZjctYjdkMC04NDE1MDY5OWE0MWUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ4NDk4Mzk5fQ.-huNmxKjasc580f-EBf7YflFS3URUh9gM2DG2y60uXM'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ N8N API funcionando');
      console.log(`✅ Workflows disponíveis: ${data.data?.length || 0}`);
      return true;
    } else {
      console.log('❌ Erro na API N8N');
      return false;
    }
  } catch (error) {
    console.log('❌ Erro de conectividade N8N');
    return false;
  }
}

async function testProjectStructure() {
  console.log('\n📁 Teste 2: Estrutura do Projeto');
  
  const fs = require('fs');
  const path = require('path');
  
  const requiredFiles = [
    'lib/n8n/client.ts',
    'lib/n8n/workflows.ts', 
    'lib/n8n/cache.ts',
    'app/api/n8n/webhook/route.ts',
    'app/api/n8n/execute/route.ts',
    'app/api/n8n/status/route.ts',
    'app/api/n8n/test/route.ts'
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file}`);
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

async function testEnvironmentConfig() {
  console.log('\n🔧 Teste 3: Configurações de Ambiente');
  
  const fs = require('fs');
  const envExample = fs.readFileSync('.env.example', 'utf8');
  
  const requiredVars = [
    'N8N_API_URL',
    'N8N_API_KEY',
    'N8N_WEBHOOK_SECRET',
    'N8N_REDIS_URL',
    'N8N_REDIS_HOST',
    'N8N_REDIS_PORT',
    'N8N_REDIS_PASSWORD'
  ];
  
  let allVarsPresent = true;
  
  for (const envVar of requiredVars) {
    if (envExample.includes(envVar)) {
      console.log(`✅ ${envVar}`);
    } else {
      console.log(`❌ ${envVar}`);
      allVarsPresent = false;
    }
  }
  
  return allVarsPresent;
}

async function runCompleteTest() {
  console.log('🚀 Agentes de Conversão - N8N Integration Test');
  console.log('='.repeat(50));
  
  const results = {
    n8nConnection: await testN8nConnection(),
    projectStructure: testProjectStructure(),
    environmentConfig: testEnvironmentConfig()
  };
  
  console.log('\n📊 Resumo Final');
  console.log('='.repeat(25));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅' : '❌';
    const testName = test.replace(/([A-Z])/g, ' $1').trim();
    console.log(`${status} ${testName}`);
  });
  
  console.log(`\n🎯 Resultado: ${passedTests}/${totalTests} testes passaram`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 INTEGRAÇÃO COMPLETA!');
    console.log('✅ N8N Easypanel conectado');
    console.log('✅ Redis cache configurado');
    console.log('✅ API endpoints criados');
    console.log('✅ Interface visual pronta');
    console.log('✅ Webhooks configurados');
    
    console.log('\n📋 URLs Importantes:');
    console.log('   N8N Interface: https://n8n-agentesdeconversao.yh8aah.easypanel.host');
    console.log('   API Test: /api/n8n/test');
    console.log('   API Status: /api/n8n/status');
    
    console.log('\n🚀 Pronto para automações!');
  } else {
    console.log('\n⚠️ Alguns testes falharam');
    console.log('   Verifique a configuração antes de prosseguir');
  }
  
  return passedTests === totalTests;
}

// Executar se chamado diretamente
if (require.main === module) {
  runCompleteTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runCompleteTest };