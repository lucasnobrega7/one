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
        // OpenAI Official Color System
        openai: {
          black: "#000000",
          white: "#FFFFFF",
          gray: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
            950: "#030712"
          },
          blue: "#3B82F6",
          green: "#10B981",
          purple: "#8B5CF6",
          orange: "#F59E0B"
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
        // OpenAI Spacing System (base 4px)
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
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
        sans: ['Söhne', 'Inter', 'Open Sans', 'system-ui', 'sans-serif'],
        sohne: ['Söhne', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        openSans: ['Open Sans', 'system-ui', 'sans-serif'],
        mono: ['Söhne Mono', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        // OpenAI Typography Scale
        'xs': ['0.75rem', { lineHeight: '1.4' }],
        'sm': ['0.875rem', { lineHeight: '1.4' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.5' }],
        'xl': ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
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
      })
    }
  ],
}

export default config