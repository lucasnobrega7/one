'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function FixDomainPage() {
  const [fixing, setFixing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const fixMainDomain = async () => {
    try {
      setFixing(true)
      const response = await fetch('/api/admin/fix-domain', {
        method: 'POST'
      })
      const result = await response.json()
      
      setResult(result)
      
      if (result.success) {
        toast({
          title: 'Sucesso',
          description: 'Domínio principal corrigido! Aguarde propagação DNS.',
        })
      } else {
        throw new Error(result.error || 'Domain fix failed')
      }
    } catch (error) {
      console.error('Error fixing domain:', error)
      toast({
        title: 'Erro',
        description: 'Falha na correção do domínio principal',
        variant: 'destructive'
      })
    } finally {
      setFixing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-red-500" />
              Correção do Domínio Principal
            </CardTitle>
            <CardDescription>
              Corrigir redirecionamento incorreto: agentesdeconversao.ai → clubedaconversao.com.br
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Status atual */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Problema identificado:</span>
              </div>
              <p className="text-red-600 mt-1">
                agentesdeconversao.ai está redirecionando para clubedaconversao.com.br
              </p>
            </div>

            {/* Ação de correção */}
            <div className="space-y-4">
              <h3 className="font-medium">Ações que serão executadas:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Remover redirects incorretos via cPanel API</li>
                <li>• Limpar registros DNS problemáticos</li>
                <li>• Configurar registros A e CNAME corretos para Vercel</li>
                <li>• Aguardar propagação DNS (5-30 minutos)</li>
              </ul>
            </div>

            {/* Botão de ação */}
            <Button
              onClick={fixMainDomain}
              disabled={fixing}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              {fixing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Corrigindo domínio...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Corrigir Domínio Principal
                </>
              )}
            </Button>

            {/* Resultado */}
            {result && (
              <div className={`border rounded-lg p-4 ${
                result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className={`flex items-center gap-2 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.success ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {result.success ? 'Correção executada com sucesso!' : 'Erro na correção'}
                  </span>
                </div>
                
                {result.redirectsRemoved && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Redirects removidos:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      {result.redirectsRemoved.map((redirect: any, index: number) => (
                        <li key={index} className="text-gray-600">
                          • {redirect.domain} → {redirect.destination}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.dnsRecords && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Registros DNS configurados:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      {result.dnsRecords.map((record: any, index: number) => (
                        <li key={index} className="text-gray-600">
                          • {record.type}: {record.name} → {record.record}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.success && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex items-center gap-2 text-blue-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Próximos passos:</span>
                    </div>
                    <p className="text-blue-600 text-sm mt-1">
                      Aguarde 5-30 minutos para propagação DNS. 
                      Teste acessando: <a href="https://agentesdeconversao.ai" target="_blank" rel="noopener noreferrer" className="underline">agentesdeconversao.ai</a>
                    </p>
                  </div>
                )}
                
                {result.error && (
                  <p className="text-red-600 text-sm mt-2">
                    {result.error}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}