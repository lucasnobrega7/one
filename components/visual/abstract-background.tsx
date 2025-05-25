'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AbstractBackgroundProps {
  variant: 'particles' | 'mesh' | 'waves' | 'geometric'
  density?: 'low' | 'medium' | 'high'
  className?: string
  interactive?: boolean
}

export function AbstractBackground({ 
  variant, 
  density = 'medium', 
  className,
  interactive = false 
}: AbstractBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let animationId: number
    let particles: any[] = []

    // Configurações baseadas na densidade
    const densityConfig = {
      low: { count: 50, speed: 0.5 },
      medium: { count: 100, speed: 1 },
      high: { count: 200, speed: 1.5 }
    }

    const config = densityConfig[density]

    // Inicializar partículas/elementos
    const initElements = () => {
      particles = []
      const count = config.count

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * config.speed,
          vy: (Math.random() - 0.5) * config.speed,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          hue: Math.random() * 60 + 200 // Azul a roxo
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (variant === 'particles') {
        particles.forEach(particle => {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`
          ctx.fill()

          // Conectar partículas próximas
          particles.forEach(other => {
            const dx = particle.x - other.x
            const dy = particle.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity * 0.1})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          })

          // Mover partícula
          particle.x += particle.vx
          particle.y += particle.vy

          // Fazer bounce nas bordas
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
        })
      } else if (variant === 'mesh') {
        const gridSize = 50
        const time = Date.now() * 0.001

        for (let x = 0; x <= canvas.width; x += gridSize) {
          for (let y = 0; y <= canvas.height; y += gridSize) {
            const wave = Math.sin(time + x * 0.01) * Math.cos(time + y * 0.01)
            const opacity = (wave + 1) * 0.1

            ctx.beginPath()
            ctx.arc(x, y, 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.fill()

            // Linhas horizontais
            if (x < canvas.width - gridSize) {
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(x + gridSize, y)
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`
              ctx.lineWidth = 1
              ctx.stroke()
            }

            // Linhas verticais
            if (y < canvas.height - gridSize) {
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(x, y + gridSize)
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        }
      }
    }

    const animate = () => {
      drawParticles()
      animationId = requestAnimationFrame(animate)
    }

    initElements()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [variant, density, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'absolute inset-0 pointer-events-none',
        className
      )}
      style={{ zIndex: -1 }}
    />
  )
}