'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

interface OpenAIButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  showArrow?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export function OpenAIButton({
  children,
  variant = 'primary',
  size = 'md',
  showArrow = false,
  disabled = false,
  loading = false,
  onClick,
  className,
  type = 'button',
  ...props
}: OpenAIButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 group relative overflow-hidden"
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-100 border border-white focus:ring-blue-500 hover:shadow-xl hover:shadow-white/25",
    secondary: "bg-black text-white hover:bg-gray-900 border border-black focus:ring-gray-500",
    outline: "bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm focus:ring-white/50",
    ghost: "bg-transparent text-white hover:bg-white/10 border-none focus:ring-white/50",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none focus:ring-blue-500 hover:shadow-xl hover:shadow-blue-500/25"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-xl"
  }
  
  const isDisabled = disabled || loading
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      {...props}
    >
      {/* Efeito de hover animado */}
      <motion.div
        className="absolute inset-0 bg-white/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10 flex items-center">
        {loading ? (
          <>
            <motion.div
              className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Carregando...
          </>
        ) : (
          <>
            {children}
            {showArrow && (
              <motion.div
                className="ml-2"
                whileHover={{ x: 2, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <ArrowUpRight className="h-4 w-4" />
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.button>
  )
}