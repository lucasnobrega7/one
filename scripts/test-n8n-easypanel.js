#!/usr/bin/env node

/**
 * Teste de integração com N8N no Easypanel
 * Verifica conectividade e API Key
 */

const N8N_API_URL = 'https://n8n-agentesdeconversao.yh8aah.easypanel.host/api/v1';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYzNlNWE5YS0yMjNjLTRlZjctYjdkMC04NDE1MDY5OWE0MWUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ4NDk4Mzk5fQ.-huNmxKjasc580f-EBf7YflFS3URUh9gM2DG2y60uXM';
const N8N_BASE_URL = 'https://n8n-agentesdeconversao.yh8aah.easypanel.host';

console.log('🧪 Testando integração N8N (Easypanel)...\n');

async function testBasicConnectivity() {
  console.log('📡 Teste 1: Conectividade básica');
  
  try {
    const response = await fetch(N8N_BASE_URL);
    if (response.ok) {
      console.log('✅ N8N está acessível');
      console.log(`   Status: ${response.status}`);
      console.log(`   URL: ${N8N_BASE_URL}`);
      return true;
    } else {
      console.log('❌ N8N não está acessível');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao conectar');
    console.log(`   Erro: ${error.message}`);
    return false;
  }
}

async function testApiKey() {
  console.log('\n🔑 Teste 2: API Key');
  
  try {
    const response = await fetch(`${N8N_API_URL}/workflows`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Key válida');
      console.log(`✅ Workflows encontrados: ${data.data?.length || 0}`);
      return data;
    } else {
      console.log('❌ API Key inválida');
      console.log(`   Status: ${response.status}`);
      console.log(`   Resposta: ${await response.text()}`);
      return null;
    }
  } catch (error) {
    console.log('❌ Erro na API');
    console.log(`   Erro: ${error.message}`);
    return null;
  }
}

async function testExecutions() {
  console.log('\n📊 Teste 3: Execuções');
  
  try {
    const response = await fetch(`${N8N_API_URL}/executions`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Endpoint de execuções acessível');
      console.log(`✅ Execuções encontradas: ${data.data?.length || 0}`);
      return data;
    } else {
      console.log('❌ Erro no endpoint de execuções');
      console.log(`   Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log('❌ Erro ao verificar execuções');
    console.log(`   Erro: ${error.message}`);
    return null;
  }
}

async function runEasypanelTests() {
  console.log('🚀 N8N Easypanel - Teste de Integração');
  console.log('='.repeat(45));
  
  const connectivityOk = await testBasicConnectivity();
  const workflowsData = await testApiKey();
  const executionsData = await testExecutions();
  
  console.log('\n📋 Resumo da Configuração:');
  console.log('─'.repeat(30));
  console.log(`✅ URL Base: ${N8N_BASE_URL}`);
  console.log(`✅ URL da API: ${N8N_API_URL}`);
  console.log('✅ Autenticação: X-N8N-API-KEY header');
  console.log('✅ Tipo: N8N Self-hosted (Easypanel)');
  console.log('✅ Persistência: Gerenciada pelo Easypanel');
  
  if (connectivityOk && workflowsData && executionsData) {
    console.log('\n🎉 SUCESSO! Integração funcionando');
    console.log('   API configurada e endpoints acessíveis');
    
    if (workflowsData.data && workflowsData.data.length > 0) {
      console.log('\n📋 Workflows disponíveis:');
      workflowsData.data.slice(0, 5).forEach((workflow, index) => {
        console.log(`   ${index + 1}. ${workflow.name} (ID: ${workflow.id})`);
      });
    } else {
      console.log('\n📋 Nenhum workflow encontrado');
      console.log('   Você pode criar workflows na interface N8N');
    }
    
    return true;
  } else {
    console.log('\n⚠️ Problemas na integração');
    console.log('   Verifique a API Key ou configurações');
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runEasypanelTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runEasypanelTests };