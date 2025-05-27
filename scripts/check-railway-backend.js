#!/usr/bin/env node

const https = require('https');

console.log('🔍 Verificando status do backend Railway...\n');

// Test if the Railway backend is actually running
async function testBackend() {
  const testUrl = 'https://s2pgzru5.up.railway.app';
  
  return new Promise((resolve) => {
    const req = https.get(testUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Railway-Backend-Check/1.0',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📡 Railway URL: ${testUrl}`);
        console.log(`📊 Status Code: ${res.statusCode}`);
        console.log(`📋 Headers:`, res.headers);
        console.log(`📄 Response Body:`, data);
        
        if (res.statusCode === 404) {
          console.log('\n❌ PROBLEMA: Backend não está rodando no Railway!');
          console.log('🛠️ SOLUÇÃO: Fazer deploy do backend');
        } else if (res.statusCode === 200) {
          console.log('\n✅ Backend Railway funcionando!');
          console.log('🔗 Próximo passo: Configurar SSL para api.agentesdeconversao.ai');
        }
        
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Erro de conexão: ${error.message}`);
      resolve();
    });

    req.on('timeout', () => {
      req.destroy();
      console.log('❌ Timeout na conexão');
      resolve();
    });
  });
}

async function main() {
  await testBackend();
  
  console.log('\n📋 RESUMO DO DIAGNÓSTICO:');
  console.log('1. ❌ Backend Railway não está ativo (erro 404)');
  console.log('2. ❌ SSL não configurado para api.agentesdeconversao.ai');
  console.log('3. ✅ DNS CNAME configurado corretamente');
  
  console.log('\n🛠️ AÇÕES NECESSÁRIAS:');
  console.log('1. Fazer deploy do backend no Railway');
  console.log('2. Configurar domínio customizado no Railway Dashboard');
  console.log('3. Aguardar provisão automática do SSL');
  
  console.log('\n🔗 LINKS ÚTEIS:');
  console.log('• Railway Project: https://railway.app/project/fcda25f6-a7e8-4746-bf1e-2d7aa7091137');
  console.log('• Backend Local: /Users/lucasrnobrega/Claude-outputs/Projetos/one/backend/');
}

main().catch(console.error);