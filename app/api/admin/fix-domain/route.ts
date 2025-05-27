import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[API] Corrigindo redirecionamento agentesdeconversao.ai...')
    
    const apiUrl = 'https://cpanel.agentesdeconversao.ai:2083/execute/Mime/list_redirects'
    const headers = {
      'Authorization': 'cpanel agentesdeconversao:Q5HZZI8QVOVKP0HI5TDUS83KHCJ6ZZHH',
      'Content-Type': 'application/json'
    }

    // 1. Listar redirecionamentos
    const listResponse = await fetch(apiUrl, { 
      method: 'GET', 
      headers 
    })
    
    if (!listResponse.ok) {
      throw new Error(`Failed to list redirects: ${listResponse.status}`)
    }
    
    const listData = await listResponse.json()
    console.log('[API] Redirects encontrados:', listData)
    
    const redirectsRemoved = []
    
    // 2. Remover redirecionamentos para clubedaconversao.com.br
    if (listData.status === 1 && listData.data) {
      for (const redirect of listData.data) {
        if (redirect.dest_url?.includes('clubedaconversao.com.br')) {
          const deleteUrl = `https://cpanel.agentesdeconversao.ai:2083/execute/Mime/delete_redirect?id=${redirect.id}`
          
          const deleteResponse = await fetch(deleteUrl, {
            method: 'GET',
            headers
          })
          
          if (deleteResponse.ok) {
            redirectsRemoved.push({
              source: redirect.source_url,
              destination: redirect.dest_url,
              id: redirect.id
            })
            console.log(`[API] Redirect removido: ${redirect.source_url} → ${redirect.dest_url}`)
          }
        }
      }
    }

    // 3. Configurar DNS correto para Vercel
    const dnsRecords = []
    
    // Adicionar registro A para @
    const aRecordUrl = 'https://cpanel.agentesdeconversao.ai:2083/execute/ZoneEdit/add_zone_record?domain=agentesdeconversao.ai&name=@&type=A&record=76.76.19.61&ttl=14400'
    const aResponse = await fetch(aRecordUrl, { method: 'GET', headers })
    
    if (aResponse.ok) {
      dnsRecords.push({ type: 'A', name: '@', record: '76.76.19.61' })
    }

    // Adicionar CNAME para www
    const cnameUrl = 'https://cpanel.agentesdeconversao.ai:2083/execute/ZoneEdit/add_zone_record?domain=agentesdeconversao.ai&name=www&type=CNAME&record=cname.vercel-dns.com&ttl=14400'
    const cnameResponse = await fetch(cnameUrl, { method: 'GET', headers })
    
    if (cnameResponse.ok) {
      dnsRecords.push({ type: 'CNAME', name: 'www', record: 'cname.vercel-dns.com' })
    }

    return NextResponse.json({
      success: true,
      message: 'Domínio corrigido com sucesso!',
      redirectsRemoved,
      dnsRecords,
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
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}