"use client"

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface EmotivePointProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  intensity?: 'low' | 'medium' | 'high'
  responsive?: boolean
  className?: string
}

export const EmotivePoint: React.FC<EmotivePointProps> = ({
  size = 'md',
  intensity = 'medium',
  responsive = true,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const timeRef = useRef(0)

  const sizes = {
    sm: { width: 40, height: 40 },
    md: { width: 60, height: 60 },
    lg: { width: 80, height: 80 },
    xl: { width: 120, height: 120 }
  }

  const intensityLevels = {
    low: { amplitude: 0.3, frequency: 0.8, opacity: 0.6 },
    medium: { amplitude: 0.5, frequency: 1.2, opacity: 0.8 },
    high: { amplitude: 0.8, frequency: 1.8, opacity: 1.0 }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = sizes[size]
    const { amplitude, frequency, opacity } = intensityLevels[intensity]
    
    canvas.width = width * 2 // Para suporte a displays de alta resolução
    canvas.height = height * 2
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(2, 2)

    const centerX = width / 2
    const centerY = height / 2
    const baseRadius = Math.min(width, height) * 0.3

    const animate = () => {
      timeRef.current += 0.016 // ~60fps

      // Limpar canvas
      ctx.clearRect(0, 0, width, height)

      // Criar gradiente radial animado
      const time = timeRef.current * frequency
      const radiusVariation = Math.sin(time) * amplitude * 0.2
      const currentRadius = baseRadius + radiusVariation

      // Background watercolor effect
      const bgGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, currentRadius * 2
      )
      
      // Cores inspiradas no novo design OpenAI
      const hue1 = 210 + Math.sin(time * 0.5) * 30  // Azul dinâmico
      const hue2 = 270 + Math.cos(time * 0.3) * 40  // Roxo dinâmico
      
      bgGradient.addColorStop(0, `hsla(${hue1}, 70%, 60%, ${opacity * 0.8})`)
      bgGradient.addColorStop(0.4, `hsla(${hue2}, 60%, 50%, ${opacity * 0.6})`)
      bgGradient.addColorStop(0.7, `hsla(${hue1 + 30}, 50%, 40%, ${opacity * 0.3})`)
      bgGradient.addColorStop(1, `hsla(${hue2 - 20}, 40%, 30%, 0)`)

      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Círculo central pulsante
      const pulseVariation = Math.sin(time * 2) * amplitude * 0.1
      const coreRadius = currentRadius * 0.6 + pulseVariation

      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreRadius
      )
      
      coreGradient.addColorStop(0, `hsla(${hue1}, 80%, 70%, ${opacity})`)
      coreGradient.addColorStop(0.6, `hsla(${hue2}, 70%, 60%, ${opacity * 0.7})`)
      coreGradient.addColorStop(1, `hsla(${hue1}, 60%, 50%, 0)`)

      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
      ctx.fill()

      // Ondas concêntricas
      for (let i = 0; i < 3; i++) {
        const waveRadius = currentRadius * (0.8 + i * 0.4) + Math.sin(time + i) * amplitude * 5
        const waveOpacity = opacity * (0.3 - i * 0.1)
        
        ctx.strokeStyle = `hsla(${hue1 + i * 20}, 60%, 60%, ${waveOpacity})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2)
        ctx.stroke()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [size, intensity])

  return (
    <div className={cn(
      "emotive-point-container",
      "relative inline-block",
      responsive && "max-w-full h-auto",
      className
    )}>
      <canvas
        ref={canvasRef}
        className={cn(
          "rounded-full",
          "filter blur-[0.5px]", // Suave imperfeição
          "transition-opacity duration-300",
          "hover:opacity-90"
        )}
        style={{
          background: 'transparent',
          imageRendering: 'optimizeQuality'
        }}
      />
      
      {/* Efeito de brilho sutil */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full",
          "bg-gradient-to-r from-blue-400/10 via-purple-500/10 to-blue-600/10",
          "opacity-0 hover:opacity-100",
          "transition-opacity duration-500",
          "pointer-events-none"
        )}
      />
    </div>
  )
}

// Variações pré-configuradas para diferentes contextos
export const EmotivePointHero = () => (
  <EmotivePoint size="xl" intensity="high" className="mx-auto" />
)

export const EmotivePointCard = () => (
  <EmotivePoint size="md" intensity="medium" className="mx-auto" />
)

export const EmotivePointIcon = () => (
  <EmotivePoint size="sm" intensity="low" className="inline-block" />
)

export default EmotivePoint