import { NextRequest, NextResponse } from 'next/server'
import { CPanelAPIClient } from '@/lib/cpanel/client'

/**
 * POST /api/admin/fix-domain
 * Corrige configuração do domínio principal agentesdeconversao.ai
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[API] Iniciando correção do domínio principal...')
    
    const cpanel = new CPanelAPIClient({
      baseUrl: 'https://cpanel.agentesdeconversao.ai:2083',
      username: 'agentesdeconversao',
      apiToken: 'Q5HZZI8QVOVKP0HI5TDUS83KHCJ6ZZHH',
      domain: 'agentesdeconversao.ai'
    })

    const results = []

    // 1. Verificar e remover redirecionamentos incorretos
    console.log('[API] Verificando redirecionamentos...')
    try {
      const redirects = await cpanel.executeAPI('Mime', 'list_redirects')
      results.push({
        step: 'list_redirects',
        success: redirects.success,
        message: redirects.success ? 'Redirecionamentos listados' : 'Erro ao listar redirecionamentos',
        details: redirects.data
      })

      // Remover redirecionamentos para clubedaconversao.com.br
      if (redirects.success && redirects.data) {
        for (const redirect of redirects.data) {
          if (redirect.dest_url?.includes('clubedaconversao.com.br')) {
            console.log(`[API] Removendo redirecionamento: ${redirect.source_url} → ${redirect.dest_url}`)
            const removeResult = await cpanel.executeAPI('Mime', 'delete_redirect', {
              id: redirect.id
            })
            
            results.push({
              step: 'remove_redirect',
              success: removeResult.success,
              message: removeResult.success ? 'Redirecionamento removido' : 'Erro ao remover redirecionamento',
              details: { source: redirect.source_url, dest: redirect.dest_url }
            })
          }
        }
      }
    } catch (error) {
      results.push({
        step: 'redirects_check',
        success: false,
        message: 'Erro na verificação de redirecionamentos',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // 2. Adicionar registro A para o domínio raiz
    const addARecord = await cpanel.addDNSRecord({
      name: '@',
      type: 'A', 
      record: '76.76.19.61', // Vercel IP
      ttl: 14400
    })
    
    results.push({
      step: 'add_a_record',
      success: addARecord.success,
      message: addARecord.success ? 'Registro A adicionado' : 'Erro ao adicionar registro A',
      details: addARecord.errors
    })

    // 3. Adicionar CNAME para www
    const addCNAME = await cpanel.addDNSRecord({
      name: 'www',
      type: 'CNAME',
      record: 'cname.vercel-dns.com',
      ttl: 14400
    })
    
    results.push({
      step: 'add_cname',
      success: addCNAME.success,
      message: addCNAME.success ? 'CNAME www adicionado' : 'Erro ao adicionar CNAME',
      details: addCNAME.errors
    })

    const successCount = results.filter(r => r.success).length
    const totalSteps = results.length

    return NextResponse.json({
      success: successCount === totalSteps,
      message: successCount === totalSteps 
        ? 'Domínio corrigido! Aguarde propagação DNS (15-30 min)' 
        : `Parcialmente concluído: ${successCount}/${totalSteps}`,
      data: {
        summary: { total: totalSteps, successful: successCount },
        results,
        nextSteps: [
          'Aguardar propagação DNS (15-30 minutos)',
          'Testar: https://agentesdeconversao.ai',
          'Verificar que não redireciona para clubedaconversao.com.br',
          'Confirmar na Vercel se aparece "Configured Correctly"'
        ]
      }
    })
    
  } catch (error) {
    console.error('[API] Erro na correção do domínio:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro interno durante correção do domínio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}