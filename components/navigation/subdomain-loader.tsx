'use client'

import React, { useEffect, useState } from 'react'
import { Loader2, ExternalLink, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubdomainLoaderProps {
  isLoading: boolean
  targetSubdomain: string
  targetUrl: string
  onComplete?: () => void
}

export function SubdomainLoader({ 
  isLoading, 
  targetSubdomain, 
  targetUrl, 
  onComplete 
}: SubdomainLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState<'preparing' | 'connecting' | 'redirecting'>('preparing')

  useEffect(() => {
    if (!isLoading) {
      setProgress(0)
      setStage('preparing')
      return
    }

    const stages = [
      { stage: 'preparing', duration: 500, progress: 30 },
      { stage: 'connecting', duration: 800, progress: 70 },
      { stage: 'redirecting', duration: 300, progress: 100 },
    ]

    let currentStageIndex = 0
    let stageProgress = 0

    const interval = setInterval(() => {
      const currentStage = stages[currentStageIndex]
      
      stageProgress += 2
      const totalProgress = 
        (currentStageIndex * 33.33) + 
        (stageProgress / 100) * 33.33

      setProgress(Math.min(totalProgress, currentStage.progress))

      if (stageProgress >= 100) {
        setStage(currentStage.stage as any)
        
        if (currentStageIndex < stages.length - 1) {
          currentStageIndex++
          stageProgress = 0
        } else {
          clearInterval(interval)
          setTimeout(() => {
            onComplete?.()
          }, 200)
        }
      }
    }, 20)

    return () => clearInterval(interval)
  }, [isLoading, onComplete])

  if (!isLoading) return null

  const getStageMessage = () => {
    switch (stage) {
      case 'preparing':
        return 'Preparando navegação...'
      case 'connecting':
        return `Conectando com ${targetSubdomain}.agentesdeconversao.ai...`
      case 'redirecting':
        return 'Redirecionando...'
      default:
        return 'Carregando...'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-[#1a1a1d] border border-[#27272a] rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] rounded-lg flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Navegação Cross-Domain</h3>
            <p className="text-gray-400 text-sm">Preservando seu contexto...</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">{getStageMessage()}</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Target URL Preview */}
        <div className="bg-[#0e0e10] border border-[#27272a] rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Destino:</span>
            <span className="text-blue-400 font-mono truncate">{targetUrl}</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Carregando recursos...</span>
        </div>

        {/* Fallback Info */}
        <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-xs">
            💡 Se o carregamento demorar, você será redirecionado automaticamente
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook para gerenciar navegação entre subdomínios com loading
 */
export function useSubdomainNavigation() {
  const [isLoading, setIsLoading] = useState(false)
  const [targetInfo, setTargetInfo] = useState<{
    subdomain: string
    url: string
  } | null>(null)

  const navigateToSubdomain = async (subdomain: string, url: string) => {
    setIsLoading(true)
    setTargetInfo({ subdomain, url })

    // Preload DNS e recursos críticos
    if (typeof window !== 'undefined') {
      try {
        // Prefetch DNS
        const link = document.createElement('link')
        link.rel = 'dns-prefetch'
        link.href = new URL(url).origin
        document.head.appendChild(link)

        // Prefetch page
        const prefetchLink = document.createElement('link')
        prefetchLink.rel = 'prefetch'
        prefetchLink.href = url
        document.head.appendChild(prefetchLink)

        // Simular verificação de conectividade
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.warn('Erro no preload:', error)
      }
    }

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = url
        }
        resolve()
      }, 1600) // Tempo total do loading
    })
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setTargetInfo(null)
  }

  return {
    isLoading,
    targetInfo,
    navigateToSubdomain,
    LoaderComponent: () => (
      <SubdomainLoader
        isLoading={isLoading}
        targetSubdomain={targetInfo?.subdomain || ''}
        targetUrl={targetInfo?.url || ''}
        onComplete={handleLoadingComplete}
      />
    )
  }
}