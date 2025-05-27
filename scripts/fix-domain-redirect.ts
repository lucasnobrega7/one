#!/usr/bin/env ts-node

/**
 * Script para corrigir redirecionamento incorreto do agentesdeconversao.ai
 * Remove redirecionamento para clubedaconversao.com.br e configura para Vercel
 */

import { CPanelAPIClient } from '../lib/cpanel/client'

async function fixDomainRedirect() {
  console.log('🔧 Corrigindo redirecionamento do agentesdeconversao.ai...')
  
  const cpanel = new CPanelAPIClient({
    baseUrl: 'https://cpanel.agentesdeconversao.ai:2083',
    username: 'agentesdeconversao', 
    apiToken: 'Q5HZZI8QVOVKP0HI5TDUS83KHCJ6ZZHH',
    domain: 'agentesdeconversao.ai'
  })

  try {
    console.log('📋 Verificando redirecionamentos atuais...')
    
    // 1. Listar redirecionamentos existentes
    const redirects = await cpanel.executeAPI('Mime', 'list_redirects')
    console.log('✅ Redirecionamentos encontrados:', redirects.data?.length || 0)
    
    if (redirects.success && redirects.data) {
      for (const redirect of redirects.data) {
        if (redirect.source_url?.includes('agentesdeconversao.ai') && 
            redirect.dest_url?.includes('clubedaconversao.com.br')) {
          console.log(`🗑️ Removendo redirecionamento: ${redirect.source_url} → ${redirect.dest_url}`)
          
          // Remover redirecionamento incorreto
          const removeResult = await cpanel.executeAPI('Mime', 'delete_redirect', {
            id: redirect.id
          })
          
          if (removeResult.success) {
            console.log('✅ Redirecionamento removido com sucesso!')
          } else {
            console.log('❌ Erro ao remover redirecionamento:', removeResult.errors)
          }
        }
      }
    }

    // 2. Verificar e limpar registros DNS problemáticos
    console.log('🌐 Verificando registros DNS...')
    const dnsRecords = await cpanel.listDNSRecords()
    
    if (dnsRecords.success && dnsRecords.data) {
      console.log(`📋 Encontrados ${dnsRecords.data.length} registros DNS`)
      
      // Procurar registros que possam estar causando o redirecionamento
      for (const record of dnsRecords.data) {
        if (record.record?.includes('clubedaconversao.com.br')) {
          console.log(`🗑️ Removendo registro DNS problemático: ${record.name} → ${record.record}`)
          
          const deleteResult = await cpanel.deleteDNSRecord(record.line)
          if (deleteResult.success) {
            console.log('✅ Registro DNS problemático removido!')
          } else {
            console.log('❌ Erro ao remover registro DNS:', deleteResult.errors)
          }
        }
      }
    }

    // 3. Configurar registros DNS corretos para Vercel
    console.log('⚙️ Configurando registros DNS para Vercel...')
    
    // Registro A para o domínio raiz
    const addARecord = await cpanel.addDNSRecord({
      name: '@',
      type: 'A',
      record: '76.76.19.61', // IP do Vercel
      ttl: 14400
    })
    
    if (addARecord.success) {
      console.log('✅ Registro A configurado: @ → 76.76.19.61')
    } else {
      console.log('⚠️ Registro A:', addARecord.errors)
    }

    // CNAME para www
    const addCNAME = await cpanel.addDNSRecord({
      name: 'www',
      type: 'CNAME', 
      record: 'cname.vercel-dns.com',
      ttl: 14400
    })
    
    if (addCNAME.success) {
      console.log('✅ CNAME configurado: www → cname.vercel-dns.com')
    } else {
      console.log('⚠️ CNAME:', addCNAME.errors)
    }

    // 4. Verificar configuração final
    console.log('🔍 Verificando configuração final...')
    const verification = await cpanel.verifySubdomain('')
    
    console.log('\n🎉 Correção do redirecionamento concluída!')
    console.log('📋 Status:')
    console.log(`   • DNS existe: ${verification.exists}`)
    console.log(`   • Domínio resolve: ${verification.resolves}`)
    console.log(`   • Tempo de resposta: ${verification.responseTime}ms`)
    
    console.log('\n📋 Próximos passos:')
    console.log('   1. Aguardar propagação DNS (15-30 minutos)')
    console.log('   2. Testar: https://agentesdeconversao.ai')
    console.log('   3. Verificar que não redireciona mais para clubedaconversao.com.br')
    console.log('   4. Confirmar na Vercel que aparece como "Configured Correctly"')
    
  } catch (error) {
    console.error('❌ Erro na correção:', error)
    
    console.log('\n🔧 Correção manual necessária via cPanel:')
    console.log('   1. Acesse: https://cpanel.agentesdeconversao.ai:2083')
    console.log('   2. Vá em "Redirects" e remova qualquer redirecionamento para clubedaconversao.com.br')
    console.log('   3. Vá em "Zone Editor" > agentesdeconversao.ai')
    console.log('   4. Remova registros que apontam para clubedaconversao.com.br')
    console.log('   5. Adicione:')
    console.log('      • A Record: @ → 76.76.19.61')
    console.log('      • CNAME: www → cname.vercel-dns.com')
    console.log('   6. Salve e teste o domínio')
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  fixDomainRedirect().catch(console.error)
}

export { fixDomainRedirect }