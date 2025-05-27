import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // OpenAI 2025 Rebrand Color System
        openai: {
          // Core Identity Colors (2025)
          black: "#000000",
          white: "#FFFFFF",
          
          // Grays and Blues Base (evocam horizontes, céus e espaço expansivo)
          gray: {
            50: "#FAFBFC",   // Horizonte claro
            100: "#F5F6F7",  // Céu matinal  
            200: "#E8EAED",  // Névoa suave
            300: "#DADCE0",  // Nuvem distante
            400: "#9AA0A6",  // Crepúsculo
            500: "#5F6368",  // Céu nublado
            600: "#3C4043",  // Fim de tarde
            700: "#202124",  // Noite chegando
            800: "#171717",  // Espaço profundo
            900: "#0D0D0D",  // Cosmos infinito
            950: "#000000"   // Vazio absoluto
          },
          
          // Paleta Horizon (inspirada em "horizontes, céus e espaço expansivo")
          horizon: {
            sky: "#E3F2FD",      // Céu de manhã
            dawn: "#BBDEFB",     // Aurora
            day: "#90CAF9",      // Meio-dia
            dusk: "#64B5F6",     // Entardecer
            night: "#42A5F5",    // Noite estrelada
            deep: "#2196F3",     // Profundidade oceânica
            void: "#1976D2",     // Vazio cósmico
          },
          
          // Primary Contrasting Colors (2025)
          blue: "#2196F3",      // Azul principal 2025
          cyan: "#00BCD4",      // Ciano vibrante
          purple: "#9C27B0",    // Roxo contrastante
          indigo: "#3F51B5",    // Índigo profundo
          
          // Accent Colors (vivid)
          accent: {
            electric: "#00E5FF", // Elétrico
            violet: "#D500F9",   // Violeta vívido
            emerald: "#00C853",  // Esmeralda
            amber: "#FFC107",    // Âmbar
            coral: "#FF5722",    // Coral
          }
        },
        // Manter cores existentes para compatibilidade
        immersive: {
          black: "#000000",
          white: "#FFFFFF"
        },
        functional: {
          white: "#FFFFFF",
          gray: "#F5F5F5"
        },
        primary: {
          blue: "#0EA5E9",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Existing shadcn colors
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Dark-tech elegante - Enhanced Surface colors
        surface: {
          base: '#0e0e10',    // bg overall
          raised: '#1a1a1d',  // cards 
          stroke: '#27272a',  // borda sutil
          hover: '#2a2a2e',   // hover states
          active: '#34343a',  // active states
        },
        // Dark-tech elegante - Enhanced Accent colors
        accent: {
          start: '#46B2E0',   // cyan
          mid: '#8A53D2',     // purple  
          end: '#E056A0',     // pink
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",  // 16px para cards grandes
        "2xl": "calc(var(--radius) + 8px)", // 20px para containers
        openai: "12px", // Border radius padrão OpenAI
      },
      spacing: {
        // Sistema de espaçamento otimizado baseado na documentação Tailwind (base 0.25rem = 4px)
        'px': '1px',
        '0': '0px',
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '1.5': '0.375rem',  // 6px
        '2': '0.5rem',      // 8px
        '2.5': '0.625rem',  // 10px
        '3': '0.75rem',     // 12px
        '3.5': '0.875rem',  // 14px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '7': '1.75rem',     // 28px
        '8': '2rem',        // 32px
        '9': '2.25rem',     // 36px
        '10': '2.5rem',     // 40px
        '11': '2.75rem',    // 44px
        '12': '3rem',       // 48px
        '14': '3.5rem',     // 56px
        '16': '4rem',       // 64px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
        '28': '7rem',       // 112px
        '32': '8rem',       // 128px
        '36': '9rem',       // 144px
        '40': '10rem',      // 160px
        '44': '11rem',      // 176px
        '48': '12rem',      // 192px
        '52': '13rem',      // 208px
        '56': '14rem',      // 224px
        '60': '15rem',      // 240px
        '64': '16rem',      // 256px
        '72': '18rem',      // 288px
        '80': '20rem',      // 320px
        '96': '24rem',      // 384px
      },
      animation: {
        'float': 'float 8s infinite ease-in-out',
        'mesh-pulse': 'mesh-pulse 4s infinite ease-in-out',
        'wave-flow': 'wave-flow 6s infinite ease-in-out',
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fade-in 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-up': 'slide-up 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'bounce-in': 'bounce-in 800ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      boxShadow: {
        'openai-sm': '0 1px 3px rgba(255, 255, 255, 0.04), 0 1px 2px rgba(255, 255, 255, 0.02)',
        'openai-md': '0 4px 8px rgba(255, 255, 255, 0.06), 0 2px 4px rgba(255, 255, 255, 0.04)',
        'openai-lg': '0 8px 24px rgba(255, 255, 255, 0.08), 0 4px 8px rgba(255, 255, 255, 0.04)',
        'openai-xl': '0 20px 40px rgba(255, 255, 255, 0.1), 0 8px 16px rgba(255, 255, 255, 0.06)',
      },
      transitionTimingFunction: {
        'openai': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontFamily: {
        // Inter como fonte principal OpenAI
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        // Escala tipográfica otimizada baseada na documentação Tailwind + Open Sans
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: 'normal' }],
        'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.025em' }],
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.025em' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      addUtilities({
        '.transition-openai': {
          'transition': 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.transition-openai-fast': {
          'transition': 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.transition-openai-slow': {
          'transition': 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        // Classes de estilo OpenAI 2025
        '.openai-nav': {
          'backdrop-filter': 'blur(12px)',
          'background': 'rgba(0, 0, 0, 0.8)',
          'border-bottom': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.openai-card': {
          'background': 'rgba(255, 255, 255, 0.02)',
          'border': '1px solid rgba(255, 255, 255, 0.08)',
          'border-radius': '12px',
          'backdrop-filter': 'blur(8px)',
        },
        '.openai-card-elevated': {
          'background': 'rgba(255, 255, 255, 0.04)',
          'border': '1px solid rgba(255, 255, 255, 0.12)', 
          'border-radius': '12px',
          'backdrop-filter': 'blur(12px)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
        '.openai-card-interactive': {
          'background': 'rgba(255, 255, 255, 0.02)',
          'border': '1px solid rgba(255, 255, 255, 0.08)',
          'border-radius': '12px',
          'backdrop-filter': 'blur(8px)',
          'transition': 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          'cursor': 'pointer',
        },
        '.openai-card-interactive:hover': {
          'background': 'rgba(255, 255, 255, 0.06)',
          'border-color': 'rgba(255, 255, 255, 0.16)',
          'transform': 'translateY(-2px)',
          'box-shadow': '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
        '.btn-openai-primary': {
          'background': 'linear-gradient(135deg, #46B2E0 0%, #8A53D2 100%)',
          'border': '1px solid transparent',
          'border-radius': '12px',
          'color': 'white',
          'font-weight': '600',
          'transition': 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.btn-openai-primary:hover': {
          'background': 'linear-gradient(135deg, #3da3d1 0%, #7b4bc3 100%)',
          'transform': 'translateY(-1px)',
          'box-shadow': '0 8px 24px rgba(70, 178, 224, 0.3)',
        },
        '.btn-openai-secondary': {
          'background': 'rgba(255, 255, 255, 0.08)',
          'border': '1px solid rgba(255, 255, 255, 0.16)',
          'border-radius': '12px',
          'color': 'white',
          'backdrop-filter': 'blur(8px)',
          'transition': 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.btn-openai-secondary:hover': {
          'background': 'rgba(255, 255, 255, 0.12)',
          'border-color': 'rgba(255, 255, 255, 0.24)',
        },
        '.btn-openai-ghost': {
          'background': 'transparent',
          'border': '1px solid transparent',
          'border-radius': '12px',
          'color': 'rgba(255, 255, 255, 0.8)',
          'transition': 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.btn-openai-ghost:hover': {
          'background': 'rgba(255, 255, 255, 0.06)',
          'color': 'white',
        },
        '.elevation-1': {
          'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
        '.elevation-2': {
          'box-shadow': '0 4px 16px rgba(0, 0, 0, 0.12)',
        },
        '.elevation-3': {
          'box-shadow': '0 8px 24px rgba(0, 0, 0, 0.15)',
        },
      })
    }
  ],
}

export default config