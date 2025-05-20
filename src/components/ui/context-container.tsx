'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { ParticleBackground } from './particle-background'
import { cn } from '@/lib/utils'

type ContextType = 'functional' | 'immersive'

interface ContextContainerProps {
  children: React.ReactNode
  className?: string
  context?: ContextType
  particleType?: 'dots' | 'lines' | 'grid'
  particleDensity?: 'low' | 'medium' | 'high'
  transitionDuration?: number
}

export function ContextContainer({
  children,
  className = '',
  context = 'functional',
  particleType = 'dots',
  particleDensity = 'medium',
  transitionDuration = 300,
}: ContextContainerProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentContext, setCurrentContext] = useState<ContextType>(context)
  const [transitioning, setTransitioning] = useState(false)
  
  // Handle context changes with transition
  useEffect(() => {
    if (!mounted) return
    
    if (context !== currentContext) {
      setTransitioning(true)
      
      const timer = setTimeout(() => {
        setCurrentContext(context)
        setTransitioning(false)
      }, transitionDuration)
      
      return () => clearTimeout(timer)
    }
  }, [context, currentContext, transitionDuration, mounted])
  
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return null
  }
  
  const isImmersive = currentContext === 'immersive'
  
  return (
    <div
      className={cn(
        'relative transition-colors transition-context',
        {
          'bg-background text-foreground': !isImmersive,
          'bg-gradient-dark text-white': isImmersive && theme === 'dark',
          'bg-gradient-blue-purple text-white': isImmersive && theme === 'light',
          'opacity-80': transitioning
        },
        className
      )}
      style={{ 
        transitionDuration: `${transitionDuration}ms`,
      }}
    >
      {isImmersive && (
        <ParticleBackground
          particleType={particleType}
          density={particleDensity}
          colorMode={theme === 'dark' ? 'blue-purple' : 'monochrome'}
          interactivity={true}
          className={cn(
            'transition-opacity',
            { 'opacity-0': transitioning }
          )}
          style={{ 
            transitionDuration: `${transitionDuration}ms`,
          }}
        />
      )}
      
      <div 
        className={cn(
          'relative z-10',
          { 'opacity-0': transitioning }
        )}
        style={{ 
          transitionDuration: `${transitionDuration}ms`,
          transitionProperty: 'opacity'
        }}
      >
        {children}
      </div>
    </div>
  )
}