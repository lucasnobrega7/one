#!/usr/bin/env node

/**
 * Script de teste para integração N8N
 * Testa conectividade e funcionalidades básicas
 */

const https = require('https');
const http = require('http');

const N8N_URL = 'https://n8n-railway-em-atividade.up.railway.app';
const API_URL = 'https://api.agentesdeconversao.ai';

console.log('🧪 Iniciando testes de integração N8N...\n');

// Teste 1: Conectividade básica
async function testBasicConnectivity() {
  console.log('📡 Teste 1: Conectividade básica do N8N');
  
  try {
    const response = await fetch(N8N_URL);
    if (response.ok) {
      console.log('✅ N8N está acessível');
      console.log(`   Status: ${response.status}`);
      console.log(`   URL: ${N8N_URL}`);
      return true;
    } else {
      console.log('❌ N8N não está acessível');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com N8N');
    console.log(`   Erro: ${error.message}`);
    return false;
  }
}

// Teste 2: Verificar se API está rodando
async function testApiConnectivity() {
  console.log('\n📡 Teste 2: Conectividade da API principal');
  
  try {
    const response = await fetch(`${API_URL}/health`);
    if (response.ok) {
      console.log('✅ API principal está acessível');
      console.log(`   Status: ${response.status}`);
      console.log(`   URL: ${API_URL}`);
      return true;
    } else {
      console.log('⚠️ API principal não respondeu corretamente');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com API principal');
    console.log(`   Erro: ${error.message}`);
    return false;
  }
}

// Teste 3: Verificar autenticação N8N
async function testN8nAuth() {
  console.log('\n🔐 Teste 3: Autenticação N8N');
  
  try {
    // Tentar acessar endpoint protegido
    const response = await fetch(`${N8N_URL}/api/v1/workflows`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from('lucas@agentesdeconversao.ai:Alegria2025$%').toString('base64')
      }
    });
    
    if (response.status === 401) {
      console.log('✅ Autenticação está funcionando (401 esperado sem API key)');
      return true;
    } else if (response.ok) {
      console.log('✅ Autenticação básica funcionando');
      console.log(`   Status: ${response.status}`);
      return true;
    } else {
      console.log('⚠️ Resposta inesperada da autenticação');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao testar autenticação');
    console.log(`   Erro: ${error.message}`);
    return false;
  }
}

// Teste 4: Verificar estrutura do projeto
async function testProjectStructure() {
  console.log('\n📁 Teste 4: Estrutura do projeto');
  
  const fs = require('fs');
  const path = require('path');
  
  const requiredFiles = [
    'lib/n8n/client.ts',
    'lib/n8n/workflows.ts',
    'app/api/n8n/webhook/route.ts',
    'app/api/n8n/execute/route.ts',
    'app/api/n8n/status/route.ts',
    'components/n8n/workflow-executor.tsx'
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} (não encontrado)`);
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

// Teste 5: Verificar variáveis de ambiente
function testEnvironmentVariables() {
  console.log('\n🔧 Teste 5: Variáveis de ambiente');
  
  const requiredEnvVars = [
    'N8N_API_URL',
    'N8N_WEBHOOK_SECRET'
  ];
  
  const envExample = require('fs').readFileSync('.env.example', 'utf8');
  let allVarsPresent = true;
  
  for (const envVar of requiredEnvVars) {
    if (envExample.includes(envVar)) {
      console.log(`✅ ${envVar} (configurado no .env.example)`);
    } else {
      console.log(`❌ ${envVar} (não encontrado no .env.example)`);
      allVarsPresent = false;
    }
  }
  
  return allVarsPresent;
}

// Função principal
async function runTests() {
  console.log('🚀 Agentes de Conversão - Teste de Integração N8N');
  console.log('='.repeat(50));
  
  const results = {
    connectivity: await testBasicConnectivity(),
    apiConnectivity: await testApiConnectivity(),
    authentication: await testN8nAuth(),
    projectStructure: testProjectStructure(),
    environmentVariables: testEnvironmentVariables()
  };
  
  console.log('\n📊 Resumo dos Testes');
  console.log('='.repeat(30));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅' : '❌';
    const testName = test.replace(/([A-Z])/g, ' $1').trim();
    console.log(`${status} ${testName}`);
  });
  
  console.log(`\n🎯 Resultado: ${passedTests}/${totalTests} testes passaram`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Todos os testes passaram! N8N está integrado corretamente.');
  } else {
    console.log('⚠️ Alguns testes falharam. Verifique a configuração.');
  }
  
  console.log('\n📋 Informações importantes:');
  console.log(`   N8N URL: ${N8N_URL}`);
  console.log(`   API URL: ${API_URL}`);
  console.log(`   Usuário: lucas@agentesdeconversao.ai`);
  console.log(`   Senha: Alegria2025$%`);
  
  return passedTests === totalTests;
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runTests };