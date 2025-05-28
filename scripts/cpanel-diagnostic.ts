#!/usr/bin/env tsx

/**
 * cPanel Diagnostic Script
 * Verifica configuração DNS e subdomínios
 */

import { CPanelAPIClient } from '../lib/cpanel/client'
import { SubdomainManager } from '../lib/cpanel/subdomain-manager'

// Configuração do cPanel - ajuste conforme necessário
const CPANEL_CONFIG = {
  baseUrl: process.env.CPANEL_BASE_URL || 'https://cpanel.agentesdeconversao.ai:2083',
  username: process.env.CPANEL_USERNAME || 'agentesdeconversao',
  apiToken: process.env.CPANEL_API_TOKEN || 'Q5HZZI8QVOVKP0HI5TDUS83KHCJ6ZZHH',
  domain: 'agentesdeconversao.ai'
}

async function main() {
  console.log('🔍 cPanel Diagnostic Tool - Agentes de Conversão')
  console.log('=' .repeat(60))
  
  const cpanel = new CPanelAPIClient(CPANEL_CONFIG)
  const subdomainManager = new SubdomainManager()
  
  console.log('📊 Configuração:')
  console.log(`   Base URL: ${CPANEL_CONFIG.baseUrl}`)
  console.log(`   Username: ${CPANEL_CONFIG.username}`)
  console.log(`   Domain: ${CPANEL_CONFIG.domain}`)
  console.log()
  
  // 1. Testar conexão com cPanel
  console.log('🔌 Testando conexão com cPanel...')
  try {
    const accountInfo = await cpanel.executeAPI('UserManager', 'get_user_information')
    if (accountInfo.success) {
      console.log('✅ Conexão com cPanel estabelecida')
      console.log(`   Usuário: ${accountInfo.data?.login || 'N/A'}`)
      console.log(`   Email: ${accountInfo.data?.email || 'N/A'}`)
    } else {
      console.log('❌ Falha na conexão com cPanel')
      console.log(`   Erro: ${accountInfo.errors?.join(', ')}`)
      return
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com cPanel:', error)
    return
  }
  
  console.log()
  
  // 2. Listar registros DNS atuais
  console.log('🌐 Verificando registros DNS...')
  try {
    const dnsRecords = await cpanel.listDNSRecords()
    if (dnsRecords.success && dnsRecords.data) {
      console.log(`✅ Encontrados ${dnsRecords.data.length || 0} registros DNS`)
      
      // Filtrar registros relevantes
      const relevantRecords = dnsRecords.data.filter((record: any) => 
        record.name.includes('agentesdeconversao.ai') && 
        ['A', 'CNAME'].includes(record.type)
      )
      
      console.log('\n📋 Registros DNS relevantes:')
      relevantRecords.forEach((record: any, index: number) => {
        console.log(`   ${index + 1}. ${record.name} → ${record.record} (${record.type})`)
      })
    } else {
      console.log('❌ Falha ao obter registros DNS')
      console.log(`   Erro: ${dnsRecords.errors?.join(', ')}`)
    }
  } catch (error) {
    console.log('❌ Erro ao verificar DNS:', error)
  }
  
  console.log()
  
  // 3. Listar subdomínios existentes
  console.log('🔗 Verificando subdomínios existentes...')
  try {
    const subdomains = await cpanel.listSubdomains()
    if (subdomains.success && subdomains.data) {
      console.log(`✅ Encontrados ${subdomains.data.length || 0} subdomínios`)
      
      if (subdomains.data.length > 0) {
        console.log('\n📋 Subdomínios atuais:')
        subdomains.data.forEach((subdomain: any, index: number) => {
          console.log(`   ${index + 1}. ${subdomain.domain} → ${subdomain.dir || 'N/A'}`)
        })
      }
    } else {
      console.log('❌ Falha ao obter subdomínios')
      console.log(`   Erro: ${subdomains.errors?.join(', ')}`)
    }
  } catch (error) {
    console.log('❌ Erro ao verificar subdomínios:', error)
  }
  
  console.log()
  
  // 4. Verificar status dos subdomínios necessários
  console.log('🎯 Verificando status dos subdomínios necessários...')
  const requiredSubdomains = ['lp', 'dash', 'api', 'docs', 'login']
  
  for (const subdomain of requiredSubdomains) {
    try {
      const verification = await cpanel.verifySubdomain(subdomain)
      const status = verification.exists && verification.resolves ? '✅' : '❌'
      const responseTime = verification.responseTime ? `(${verification.responseTime}ms)` : ''
      
      console.log(`   ${status} ${subdomain}.agentesdeconversao.ai ${responseTime}`)
      
      if (!verification.exists) {
        console.log(`      🔧 Solução: Criar registro CNAME para ${subdomain}`)
      } else if (!verification.resolves) {
        console.log(`      🔧 Solução: Verificar configuração do target`)
      }
    } catch (error) {
      console.log(`   ❌ ${subdomain}.agentesdeconversao.ai (erro: ${error})`)
    }
  }
  
  console.log()
  
  // 5. Verificar redirecionamentos
  console.log('🔄 Verificando redirecionamentos...')
  try {
    const redirects = await cpanel.listRedirects()
    if (redirects.success && redirects.data) {
      console.log(`✅ Encontrados ${redirects.data.length || 0} redirecionamentos`)
      
      if (redirects.data.length > 0) {
        console.log('\n📋 Redirecionamentos ativos:')
        redirects.data.forEach((redirect: any, index: number) => {
          console.log(`   ${index + 1}. ${redirect.source} → ${redirect.destination}`)
        })
      }
    } else {
      console.log('❌ Falha ao obter redirecionamentos')
    }
  } catch (error) {
    console.log('❌ Erro ao verificar redirecionamentos:', error)
  }
  
  console.log()
  
  // 6. Testar resolução DNS externa
  console.log('🌍 Testando resolução DNS externa...')
  const testDomains = [
    'agentesdeconversao.ai',
    'lp.agentesdeconversao.ai',
    'dash.agentesdeconversao.ai',
    'api.agentesdeconversao.ai'
  ]
  
  for (const domain of testDomains) {
    try {
      const startTime = Date.now()
      const response = await fetch(`https://${domain}`, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      })
      const responseTime = Date.now() - startTime
      
      const status = response.ok ? '✅' : '⚠️'
      console.log(`   ${status} ${domain} (${response.status}) ${responseTime}ms`)
      
      if (!response.ok) {
        console.log(`      🔧 Status: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.log(`   ❌ ${domain} (${error})`)
    }
  }
  
  console.log()
  console.log('=' .repeat(60))
  console.log('📝 Relatório completo gerado!')
  console.log()
  console.log('🔧 Próximas ações sugeridas:')
  console.log('   1. Verificar registros DNS no registrador do domínio')
  console.log('   2. Configurar CNAMEs para subdomínios faltantes')
  console.log('   3. Aguardar propagação DNS (até 48h)')
  console.log('   4. Testar redirecionamentos da landing page')
}

// Auto-fix mode
async function autoFix() {
  console.log('🔧 Modo Auto-Fix - Corrigindo configurações automaticamente...')
  console.log('=' .repeat(60))
  
  const subdomainManager = new SubdomainManager()
  
  // Verificar status atual
  const status = await subdomainManager.verifyAllSubdomains()
  console.log('📊 Status atual:')
  status.results.forEach(result => {
    const statusIcon = result.status === 'healthy' ? '✅' : result.status === 'degraded' ? '⚠️' : '❌'
    console.log(`   ${statusIcon} ${result.subdomain}.agentesdeconversao.ai`)
  })
  
  if (!status.allHealthy) {
    console.log('\n🔧 Corrigindo subdomínios com problemas...')
    
    const deployResult = await subdomainManager.deployAllSubdomains()
    console.log('\n📊 Resultado do deploy:')
    console.log(`   Total: ${deployResult.summary.total}`)
    console.log(`   Sucesso: ${deployResult.summary.successful}`)
    console.log(`   Falhas: ${deployResult.summary.failed}`)
    
    deployResult.results.forEach(result => {
      const statusIcon = result.success ? '✅' : '❌'
      console.log(`   ${statusIcon} ${result.subdomain}: ${result.success ? result.url : result.error}`)
    })
  } else {
    console.log('✅ Todos os subdomínios estão funcionando corretamente!')
  }
}

// CLI Interface
const command = process.argv[2]

if (command === 'fix' || command === 'auto-fix') {
  autoFix().catch(console.error)
} else {
  main().catch(console.error)
}

export { CPANEL_CONFIG }