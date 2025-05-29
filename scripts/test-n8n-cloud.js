#!/usr/bin/env node

/**
 * Teste de conectividade com N8N Cloud
 * Verifica se a API Key está funcionando corretamente
 */

const N8N_API_URL = 'https://app.n8n.cloud/api/v1';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYzNlNWE5YS0yMjNjLTRlZjctYjdkMC04NDE1MDY5OWE0MWUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ4NDk4Mzk5fQ.-huNmxKjasc580f-EBf7YflFS3URUh9gM2DG2y60uXM';

console.log('🧪 Testando conexão com N8N Cloud...\n');

async function testApiConnection() {
  console.log('📡 Teste 1: Verificando API Key');
  
  try {
    const response = await fetch(`${N8N_API_URL}/workflows`, {
      headers: {
        'Authorization': `Bearer ${N8N_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const workflows = await response.json();
      console.log('✅ API Key válida');
      console.log(`✅ Conexão com N8N Cloud estabelecida`);
      console.log(`✅ Workflows encontrados: ${workflows.data ? workflows.data.length : 0}`);
      return workflows;
    } else {
      console.log('❌ Erro na autenticação');
      console.log(`   Status: ${response.status}`);
      console.log(`   Resposta: ${await response.text()}`);
      return null;
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com N8N Cloud');
    console.log(`   Erro: ${error.message}`);
    return null;
  }
}

async function testExecutions() {
  console.log('\n📊 Teste 2: Verificando execuções');
  
  try {
    const response = await fetch(`${N8N_API_URL}/executions`, {
      headers: {
        'Authorization': `Bearer ${N8N_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const executions = await response.json();
      console.log('✅ Endpoint de execuções acessível');
      console.log(`✅ Execuções encontradas: ${executions.data ? executions.data.length : 0}`);
      return executions;
    } else {
      console.log('❌ Erro ao acessar execuções');
      console.log(`   Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log('❌ Erro ao verificar execuções');
    console.log(`   Erro: ${error.message}`);
    return null;
  }
}

async function runCloudTests() {
  console.log('🚀 N8N Cloud - Teste de Integração');
  console.log('='.repeat(40));
  
  const workflowsResult = await testApiConnection();
  const executionsResult = await testExecutions();
  
  console.log('\n📋 Resumo da Integração:');
  console.log('─'.repeat(30));
  console.log(`✅ URL da API: ${N8N_API_URL}`);
  console.log('✅ Autenticação: Bearer Token');
  console.log('✅ Tipo: N8N Cloud (SaaS)');
  console.log('✅ Persistência: Gerenciada pelo N8N Cloud');
  
  if (workflowsResult && executionsResult) {
    console.log('\n🎉 SUCESSO! Integração com N8N Cloud funcionando');
    console.log('   API Key válida e endpoints acessíveis');
    
    if (workflowsResult.data && workflowsResult.data.length > 0) {
      console.log('\n📋 Workflows disponíveis:');
      workflowsResult.data.slice(0, 5).forEach((workflow, index) => {
        console.log(`   ${index + 1}. ${workflow.name} (ID: ${workflow.id})`);
      });
    }
    
    return true;
  } else {
    console.log('\n⚠️ Problemas na integração');
    console.log('   Verifique a API Key ou permissões');
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runCloudTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runCloudTests };