"use client"

import { ReactNode, useEffect, useState } from 'react'

interface ContextTransitionProps {
  children: ReactNode
  from: 'immersive' | 'functional'
  to: 'immersive' | 'functional'
  duration?: number
  className?: string
}

export function ContextTransition({
  children,
  from,
  to,
  duration = 300,
  className = ''
}: ContextTransitionProps) {
  const [currentContext, setCurrentContext] = useState(from)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentContext(to)
    }, duration)
    return () => clearTimeout(timer)
  }, [to, duration])

  const getContextClasses = () => {
    if (currentContext === 'immersive') {
      return 'bg-black text-white'
    } else {
      return 'bg-white text-black'
    }
  }

  return (
    <div
      className={`
        context-transition
        ${getContextClasses()}
        ${className}
      `}
      style={{
        transitionDuration: `${duration}ms`,
        transitionProperty: 'background-color, color',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {children}
    </div>
  )
}