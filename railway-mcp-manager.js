/**
 * Railway MCP Manager
 * 
 * Este script gerencia integrações MCP do Railway para LLMs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Configuração do MCP
const CONFIG_FILE = path.join(__dirname, 'railway-mcp-config.json');
let config = {};

try {
  const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
  config = JSON.parse(configData);
  console.log('✅ Configuração MCP carregada');
} catch (error) {
  console.error('❌ Erro ao carregar configuração:', error.message);
  process.exit(1);
}

// Interface de linha de comando
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Funções para gerenciar MCPs
async function setupMCP() {
  console.log('\n📦 Configurando MCP para Railway...');
  
  // Verificar status do Railway
  try {
    const status = execSync('railway status', { stdio: 'pipe' }).toString();
    console.log('Status do Railway:', status);
  } catch (error) {
    console.log('⚠️ Projeto Railway não linkado. Use railway link primeiro.');
    return;
  }
  
  // Criar arquivo de configuração Claude MCP
  const claudeMcpConfig = {
    services: {
      railway: {
        projectId: config.railway.project,
        environment: config.railway.environment
      },
      supabase: config.services.supabase,
      llm: {
        provider: config.llm.provider,
        model: config.llm.model
      }
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, '.claude-code-mcp.json'),
    JSON.stringify(claudeMcpConfig, null, 2)
  );
  
  console.log('✅ Arquivo de configuração MCP criado');
  console.log('✨ Configuração MCP concluída!');
}

async function deployWithMCP() {
  console.log('\n🚀 Implantando aplicação com suporte a MCP...');
  
  try {
    execSync('chmod +x ./railway-deploy.sh', { stdio: 'inherit' });
    execSync('./railway-deploy.sh', { stdio: 'inherit' });
    console.log('✅ Deploy com MCP concluído!');
  } catch (error) {
    console.error('❌ Erro durante o deploy:', error.message);
  }
}

async function monitorMCP() {
  console.log('\n📊 Monitorando MCPs...');
  
  try {
    const logs = execSync('railway logs', { stdio: 'pipe' }).toString();
    console.log('Logs recentes:');
    console.log(logs.split('\n').slice(-20).join('\n'));
  } catch (error) {
    console.error('❌ Erro ao buscar logs:', error.message);
  }
}

// Menu principal
function showMenu() {
  console.log('\n🔧 Railway MCP Manager');
  console.log('1. Configurar MCP');
  console.log('2. Fazer deploy com MCP');
  console.log('3. Monitorar MCPs');
  console.log('4. Sair');
  
  rl.question('\nEscolha uma opção: ', async (answer) => {
    switch (answer) {
      case '1':
        await setupMCP();
        showMenu();
        break;
      case '2':
        await deployWithMCP();
        showMenu();
        break;
      case '3':
        await monitorMCP();
        showMenu();
        break;
      case '4':
        console.log('👋 Saindo...');
        rl.close();
        break;
      default:
        console.log('⚠️ Opção inválida, tente novamente.');
        showMenu();
        break;
    }
  });
}

// Iniciar o programa
console.log('🚂 Railway MCP Manager iniciado');
showMenu();

process.on('SIGINT', () => {
  console.log('\n👋 Saindo...');
  rl.close();
  process.exit(0);
});