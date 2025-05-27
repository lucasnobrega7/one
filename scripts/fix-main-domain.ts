#!/usr/bin/env ts-node

/**
 * Script para corrigir configuração do domínio principal agentesdeconversao.ai
 * Este script usa a cPanel API para configurar o redirecionamento correto
 */

import { CPanelAPIClient } from '../lib/cpanel/client'

async function fixMainDomain() {
  console.log('🔧 Iniciando correção do domínio principal agentesdeconversao.ai...')
  
  const cpanel = new CPanelAPIClient({
    baseUrl: 'https://cpanel.agentesdeconversao.ai:2083',
    username: 'agentesdeconversao',
    apiToken: 'Q5HZZI8QVOVKP0HI5TDUS83KHCJ6ZZHH',
    domain: 'agentesdeconversao.ai'
  })

  try {
    // 1. Verificar registros DNS atuais
    console.log('📋 Verificando registros DNS atuais...')
    const dnsRecords = await cpanel.listDNSRecords()
    
    if (dnsRecords.success) {
      console.log('✅ DNS Records encontrados:', dnsRecords.data?.length || 0)
    } else {
      console.log('⚠️ Erro ao listar DNS records:', dnsRecords.errors)
    }

    // 2. Configurar registro A para o domínio principal
    console.log('🌐 Configurando registro A para agentesdeconversao.ai...')
    
    // IP do Vercel (76.76.19.61 é um dos IPs públicos do Vercel)
    const addARecord = await cpanel.addDNSRecord({
      name: '@', // Root domain
      type: 'A',
      record: '76.76.19.61', // Vercel IP
      ttl: 14400
    })

    if (addARecord.success) {
      console.log('✅ Registro A adicionado com sucesso!')
    } else {
      console.log('❌ Erro ao adicionar registro A:', addARecord.errors)
    }

    // 3. Configurar CNAME para www
    console.log('🔗 Configurando CNAME para www.agentesdeconversao.ai...')
    
    const addCNAME = await cpanel.addDNSRecord({
      name: 'www',
      type: 'CNAME',
      record: 'cname.vercel-dns.com', // Vercel CNAME target
      ttl: 14400
    })

    if (addCNAME.success) {
      console.log('✅ Registro CNAME adicionado com sucesso!')
    } else {
      console.log('❌ Erro ao adicionar CNAME:', addCNAME.errors)
    }

    // 4. Configurar TXT record para verificação do Vercel
    console.log('📝 Configurando registro TXT para verificação...')
    
    const addTXTRecord = await cpanel.addDNSRecord({
      name: '_vercel',
      type: 'TXT',
      record: 'vc-domain-verify=agentesdeconversao.ai,vc-domain-verify=one-domain-verification',
      ttl: 14400
    })

    if (addTXTRecord.success) {
      console.log('✅ Registro TXT adicionado com sucesso!')
    } else {
      console.log('❌ Erro ao adicionar TXT record:', addTXTRecord.errors)
    }

    // 5. Verificar se o domínio está respondendo
    console.log('🔍 Verificando resolução do domínio...')
    
    const verification = await cpanel.verifySubdomain('')
    
    if (verification.exists && verification.resolves) {
      console.log(`✅ Domínio principal funcionando! Response time: ${verification.responseTime}ms`)
    } else {
      console.log('⚠️ Domínio ainda não está resolvendo. Aguarde propagação DNS (até 24h)')
    }

    console.log('\n🎉 Correção do domínio principal concluída!')
    console.log('📋 Próximos passos:')
    console.log('   1. Aguardar propagação DNS (15-30 minutos)')
    console.log('   2. Verificar na Vercel se o domínio aparece como "Configured Correctly"')
    console.log('   3. Testar acesso: https://agentesdeconversao.ai')
    
  } catch (error) {
    console.error('❌ Erro na correção do domínio:', error)
    
    console.log('\n🔧 Correção manual necessária via cPanel:')
    console.log('   1. Acesse: https://cpanel.agentesdeconversao.ai:2083')
    console.log('   2. Vá em Zone Editor > agentesdeconversao.ai')
    console.log('   3. Adicione os seguintes registros:')
    console.log('      • A Record: @ → 76.76.19.61')
    console.log('      • CNAME: www → cname.vercel-dns.com')
    console.log('      • TXT: _vercel → vc-domain-verify=agentesdeconversao.ai')
    console.log('   4. Salve e aguarde propagação')
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  fixMainDomain().catch(console.error)
}

export { fixMainDomain }