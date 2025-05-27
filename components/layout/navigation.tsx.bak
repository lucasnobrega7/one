"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, User, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Detectar scroll para mudar a aparência da navegação e auto-hide
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Determinar se deve mostrar/esconder navbar
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
        setUserMenuOpen(false) // Fechar menu do usuário ao esconder navbar
      }
      
      setScrolled(currentScrollY > 10)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setUserMenuOpen(false)
      setMobileMenuOpen(false)
    }

    if (userMenuOpen || mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
    
    return undefined
  }, [userMenuOpen, mobileMenuOpen])

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  const navItems = [
    { name: "Início", href: "/" },
    { name: "Recursos", href: "/features" },
    { name: "Preços", href: "/pricing" },
    { name: "Documentação", href: "/docs" },
  ]

  const userMenuItems = [
    { name: "Meu Dashboard", href: "/dashboard", icon: User },
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
    { name: "Sair", href: "/auth/signout", icon: LogOut },
  ]

  return (
    <header
      className={cn(
        "openai-nav fixed w-full z-50 transition-all duration-300",
        scrolled && "scrolled",
        !isVisible && "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-8">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM14.5 21.5C14.5 22.881 13.381 24 12 24C10.619 24 9.5 22.881 9.5 21.5C9.5 20.119 10.619 19 12 19C13.381 19 14.5 20.119 14.5 21.5ZM14.5 10.5C14.5 11.881 13.381 13 12 13C10.619 13 9.5 11.881 9.5 10.5C9.5 9.119 10.619 8 12 8C13.381 8 14.5 9.119 14.5 10.5ZM20 16C20 17.381 18.881 18.5 17.5 18.5C16.119 18.5 15 17.381 15 16C15 14.619 16.119 13.5 17.5 13.5C18.881 13.5 20 14.619 20 16ZM22.5 21.5C22.5 22.881 21.381 24 20 24C18.619 24 17.5 22.881 17.5 21.5C17.5 20.119 18.619 19 20 19C21.381 19 22.5 20.119 22.5 21.5ZM22.5 10.5C22.5 11.881 21.381 13 20 13C18.619 13 17.5 11.881 17.5 10.5C17.5 9.119 18.619 8 20 8C21.381 8 22.5 9.119 22.5 10.5Z"
                  fill="white"
                />
              </svg>
              <span className="font-medium">Agentes de Conversão</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm transition-all duration-200 relative group py-2",
                    isActive(item.href) 
                      ? "text-white font-medium" 
                      : "text-white/70 hover:text-white"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                  <span className={cn(
                    "absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-200",
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {status === "authenticated" ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setUserMenuOpen(!userMenuOpen)
                  }}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200",
                    "text-white/80 hover:text-white hover:bg-white/10",
                    userMenuOpen && "bg-white/10 text-white"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center nav-user-avatar">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">
                    {session?.user?.name || "Usuário"}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={cn(
                      "transition-transform duration-200",
                      userMenuOpen && "rotate-180"
                    )}
                  />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-black/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden nav-dropdown">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-white font-medium text-sm">{session?.user?.name}</p>
                      <p className="text-white/60 text-xs">{session?.user?.email}</p>
                    </div>
                    <div className="py-1">
                      {userMenuItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/5 transition-colors duration-150"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Icon size={16} />
                            <span className="text-sm">{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="btn-openai-ghost transition-all duration-200 hover:scale-105"
                >
                  Entrar
                </Link>
                <Link 
                  href="/signup" 
                  className="btn-openai-primary transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200" 
            onClick={(e) => {
              e.stopPropagation()
              setMobileMenuOpen(!mobileMenuOpen)
            }}
          >
            <div className="relative w-6 h-6">
              <Menu 
                size={24} 
                className={cn(
                  "absolute transition-all duration-300",
                  mobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                )}
              />
              <X 
                size={24} 
                className={cn(
                  "absolute transition-all duration-300",
                  mobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 transition-all duration-300 overflow-hidden",
        mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="container mx-auto px-4 py-6">
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm transition-all duration-200 relative",
                  "animate-in slide-in-from-left-4 fill-mode-both",
                  isActive(item.href) 
                    ? "text-white font-medium bg-white/10" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
              {status === "authenticated" ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 text-white/80">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center nav-user-avatar">
                      <User size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{session?.user?.name}</p>
                      <p className="text-white/60 text-xs">{session?.user?.email}</p>
                    </div>
                  </div>
                  {userMenuItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                          "text-white/80 hover:text-white hover:bg-white/5",
                          "animate-in slide-in-from-left-4 fill-mode-both"
                        )}
                        style={{ animationDelay: `${(navItems.length + index + 1) * 50}ms` }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon size={16} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className={cn(
                      "btn-openai-ghost w-full text-center justify-center transition-all duration-200",
                      "animate-in slide-in-from-left-4 fill-mode-both"
                    )}
                    style={{ animationDelay: `${(navItems.length + 1) * 50}ms` }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link 
                    href="/signup" 
                    className={cn(
                      "btn-openai-primary w-full text-center justify-center transition-all duration-200",
                      "animate-in slide-in-from-left-4 fill-mode-both"
                    )}
                    style={{ animationDelay: `${(navItems.length + 2) * 50}ms` }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Criar conta
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
