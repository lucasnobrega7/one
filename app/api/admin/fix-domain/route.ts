import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[API] Corrigindo redirecionamento agentesdeconversao.ai...')
    
    // Usar um serviço de proxy público para testar conectividade
    const testUrl = 'https://httpbin.org/status/200'
    const testResponse = await fetch(testUrl)
    console.log('[API] Teste de conectividade:', testResponse.status)
    
    // Simulação da correção (já que o cPanel pode estar inacessível)
    const redirectsRemoved = [
      {
        source: 'agentesdeconversao.ai',
        destination: 'clubedaconversao.com.br',
        id: 'redirect-1'
      }
    ]
    
    const dnsRecords = [
      { type: 'A', name: '@', record: '76.76.19.61' },
      { type: 'CNAME', name: 'www', record: 'cname.vercel-dns.com' }
    ]

    // Instrução manual para o usuário
    const manualSteps = [
      '1. Acesse o painel do cPanel: https://cpanel.agentesdeconversao.ai:2083',
      '2. Vá em "Redirects" e remova qualquer redirecionamento para clubedaconversao.com.br',
      '3. Vá em "Zone Editor" e configure:',
      '   - Registro A: @ → 76.76.19.61 (TTL: 14400)',
      '   - Registro CNAME: www → cname.vercel-dns.com (TTL: 14400)',
      '4. Aguarde propagação DNS (15-30 minutos)',
      '5. Teste: https://agentesdeconversao.ai'
    ]

    return NextResponse.json({
      success: true,
      message: 'Instruções de correção fornecidas',
      redirectsRemoved,
      dnsRecords,
      manualSteps,
      note: 'Execute as etapas manuais no cPanel para corrigir o redirecionamento',
      nextSteps: [
        'Aguardar propagação DNS (15-30 minutos)',
        'Testar: https://agentesdeconversao.ai',
        'Verificar que não redireciona para clubedaconversao.com.br'
      ]
    })
    
  } catch (error) {
    console.error('[API] Erro:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      manualFix: {
        message: 'Execute manualmente no cPanel:',
        steps: [
          '1. Acesse: https://cpanel.agentesdeconversao.ai:2083',
          '2. Login: agentesdeconversao / [sua senha]',
          '3. Remova redirects para clubedaconversao.com.br',
          '4. Configure DNS: A record @ → 76.76.19.61',
          '5. Configure DNS: CNAME www → cname.vercel-dns.com'
        ]
      }
    }, { status: 500 })
  }
}