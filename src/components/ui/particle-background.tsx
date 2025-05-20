'use client'

import React, { useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

interface ParticleBackgroundProps {
  className?: string
  particleCount?: number
  particleType?: 'dots' | 'lines' | 'grid'
  colorMode?: 'blue-purple' | 'monochrome'
  interactivity?: boolean
  density?: 'low' | 'medium' | 'high'
  style?: React.CSSProperties
}

export function ParticleBackground({
  className = '',
  particleCount = 50,
  particleType = 'dots',
  colorMode = 'blue-purple',
  interactivity = true,
  density = 'medium',
  style
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const rafRef = useRef<number>()
  
  // Adjust particle count based on density
  const getParticleCount = () => {
    const baseCounts = {
      low: particleCount * 0.5,
      medium: particleCount,
      high: particleCount * 2
    }
    return Math.floor(baseCounts[density])
  }
  
  // Get particle colors based on mode
  const getParticleColor = () => {
    const colors = {
      'blue-purple': [
        'rgba(70, 178, 224, 0.8)',  // #46B2E0
        'rgba(138, 83, 210, 0.8)',   // #8A53D2
        'rgba(224, 86, 160, 0.8)'    // #E056A0
      ],
      'monochrome': theme === 'dark' 
        ? ['rgba(255, 255, 255, 0.8)', 'rgba(200, 200, 200, 0.8)', 'rgba(150, 150, 150, 0.8)']
        : ['rgba(50, 50, 50, 0.8)', 'rgba(80, 80, 80, 0.8)', 'rgba(120, 120, 120, 0.8)']
    }
    
    return colors[colorMode][Math.floor(Math.random() * colors[colorMode].length)]
  }
  
  // Initialize particles
  const initParticles = (canvas: HTMLCanvasElement) => {
    const particles: Particle[] = []
    const count = getParticleCount()
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: getParticleColor()
      })
    }
    
    return particles
  }
  
  // Draw particles based on type
  const drawParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, particles: Particle[]) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (particleType === 'dots') {
      particles.forEach(particle => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
      })
    } 
    else if (particleType === 'lines') {
      // Connect particles with lines if they're close enough
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = particles[i].color
            ctx.globalAlpha = (1 - distance / 100) * 0.5
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      
      // Draw the actual particles
      particles.forEach(particle => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
      })
    }
    else if (particleType === 'grid') {
      // Draw grid lines
      const gridSize = 30
      
      ctx.globalAlpha = 0.1
      ctx.strokeStyle = colorMode === 'blue-purple' ? '#8A53D2' : '#333333'
      ctx.lineWidth = 0.5
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      // Draw particles at grid intersections
      ctx.globalAlpha = 1
      particles.forEach(particle => {
        ctx.beginPath()
        ctx.arc(
          Math.round(particle.x / gridSize) * gridSize, 
          Math.round(particle.y / gridSize) * gridSize, 
          particle.size, 
          0, 
          Math.PI * 2
        )
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
      })
    }
    
    // Apply interactivity if enabled
    if (interactivity && mouseRef.current.active) {
      const mouse = mouseRef.current
      ctx.beginPath()
      const radius = 100
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0, 
        mouse.x, mouse.y, radius
      )
      
      gradient.addColorStop(0, colorMode === 'blue-purple' ? 'rgba(138, 83, 210, 0.2)' : 'rgba(255, 255, 255, 0.1)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      
      ctx.fillStyle = gradient
      ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  
  // Update particle positions
  const updateParticles = (canvas: HTMLCanvasElement, particles: Particle[]) => {
    return particles.map(particle => {
      // Move particles
      particle.x += particle.speedX
      particle.y += particle.speedY
      
      // Mouse interactivity
      if (interactivity && mouseRef.current.active) {
        const mouse = mouseRef.current
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const forceDirectionX = dx / distance
          const forceDirectionY = dy / distance
          const force = (100 - distance) / 500
          
          particle.speedX += forceDirectionX * force
          particle.speedY += forceDirectionY * force
        }
      }
      
      // Apply slight friction
      particle.speedX *= 0.99
      particle.speedY *= 0.99
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX = -particle.speedX
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY = -particle.speedY
      }
      
      return particle
    })
  }
  
  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Update & draw particles
    particlesRef.current = updateParticles(canvas, particlesRef.current)
    drawParticles(ctx, canvas, particlesRef.current)
    
    // Continue animation
    rafRef.current = requestAnimationFrame(animate)
  }
  
  // Handle canvas resize
  const handleResize = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const container = canvas.parentElement
    if (!container) return
    
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
    
    // Reinitialize particles
    particlesRef.current = initParticles(canvas)
  }
  
  // Handle mouse events
  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    }
  }
  
  const handleMouseLeave = () => {
    mouseRef.current.active = false
  }
  
  // Setup canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Set canvas size
    handleResize()
    
    // Initialize particles
    particlesRef.current = initParticles(canvas)
    
    // Start animation
    animate()
    
    // Add event listeners
    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    
    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      window.removeEventListener('resize', handleResize)
      canvas?.removeEventListener('mousemove', handleMouseMove)
      canvas?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])
  
  // Reinitialize on theme change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    particlesRef.current = initParticles(canvas)
  }, [theme, particleType, colorMode, density])
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={style}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  )
}