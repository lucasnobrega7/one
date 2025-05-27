import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "default" | "light" | "dark"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  href?: string
  showText?: boolean
}

const sizeConfig = {
  sm: { width: 120, height: 32, textClass: "text-lg" },
  md: { width: 160, height: 42, textClass: "text-xl" },
  lg: { width: 200, height: 52, textClass: "text-2xl" },
  xl: { width: 240, height: 62, textClass: "text-3xl" }
}

const variantConfig = {
  default: {
    src: "/AGELOGOAG1-1.png", // versão preta para tema light
    alt: "Agentes de Conversão - Logo"
  },
  light: {
    src: "/Agentes de Conversão.png", // versão clara
    alt: "Agentes de Conversão - Logo Light"
  },
  dark: {
    src: "/AGELOGOAG1-1.png", // versão preta
    alt: "Agentes de Conversão - Logo Dark"
  }
}

export function Logo({ 
  variant = "default", 
  size = "md", 
  className, 
  href = "/",
  showText = false 
}: LogoProps) {
  const { width, height, textClass } = sizeConfig[size]
  const { src, alt } = variantConfig[variant]

  const logoImage = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "object-contain transition-all duration-200",
        "hover:scale-105 hover:opacity-90",
        className
      )}
      priority
    />
  )

  const logoWithText = showText ? (
    <div className="flex items-center space-x-3 group">
      <div className="transition-transform duration-200 group-hover:scale-105">
        {logoImage}
      </div>
      {showText && (
        <span className={cn(
          "sohne-heading font-bold tracking-tight transition-colors duration-200",
          variant === "light" ? "text-white" : "text-gray-900",
          textClass
        )}>
          Agentes de Conversão
        </span>
      )}
    </div>
  ) : logoImage

  if (href) {
    return (
      <Link 
        href={href} 
        className="flex items-center transition-opacity duration-200 hover:opacity-90"
        aria-label="Voltar para página inicial - Agentes de Conversão"
      >
        {logoWithText}
      </Link>
    )
  }

  return logoWithText
}