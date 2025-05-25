"use client"

import React, { useEffect, useRef } from 'react'

interface ParticlesProps {
  count?: number
  speed?: number
  className?: string
}

export function Particles({ count = 20, speed = 1, className = "" }: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particles: HTMLElement[] = []

    // Criar partículas
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      particle.style.animationDelay = Math.random() * 8 + 's'
      particle.style.animationDuration = (8 + Math.random() * 4) * speed + 's'
      
      container.appendChild(particle)
      particles.push(particle)
    }

    // Limpeza
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
    }
  }, [count, speed])

  return <div ref={containerRef} className={`particles-container ${className}`} />
}

export function GeometricMesh({ className = "" }: { className?: string }) {
  return <div className={`geometric-mesh ${className}`} />
}

export function HarmonicWaves({ className = "" }: { className?: string }) {
  return <div className={`harmonic-waves ${className}`} />
}

interface AbstractBackgroundProps {
  type: 'particles' | 'mesh' | 'waves' | 'combined'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export function AbstractBackground({ 
  type, 
  intensity = 'medium', 
  className = "" 
}: AbstractBackgroundProps) {
  const getParticleCount = () => {
    switch (intensity) {
      case 'low': return 10
      case 'medium': return 20
      case 'high': return 35
      default: return 20
    }
  }

  const getSpeed = () => {
    switch (intensity) {
      case 'low': return 1.5
      case 'medium': return 1
      case 'high': return 0.7
      default: return 1
    }
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {(type === 'particles' || type === 'combined') && (
        <Particles count={getParticleCount()} speed={getSpeed()} />
      )}
      {(type === 'mesh' || type === 'combined') && <GeometricMesh />}
      {(type === 'waves' || type === 'combined') && <HarmonicWaves />}
    </div>
  )
}

interface ContextTransitionProps {
  from: 'immersive' | 'functional'
  to: 'immersive' | 'functional'
  duration?: number
  children: React.ReactNode
}

export function ContextTransition({ 
  from, 
  to, 
  duration = 300, 
  children 
}: ContextTransitionProps) {
  const transitionClass = duration === 200 ? 'context-transition-fast' : 'context-transition'
  const contextClass = to === 'immersive' ? 'immersive-context' : 'functional-context'

  return (
    <div className={`${transitionClass} ${contextClass}`}>
      {children}
    </div>
  )
}