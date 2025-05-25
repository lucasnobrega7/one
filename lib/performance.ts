// Performance monitoring and optimization utilities

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Measure component render time
  measureRender(componentName: string, renderFn: () => void) {
    const start = performance.now()
    renderFn()
    const end = performance.now()
    const duration = end - start
    
    this.metrics.set(`render_${componentName}`, duration)
    
    if (process.env.NODE_ENV === 'development' && duration > 16) {
      console.warn(`Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`)
    }
  }

  // Measure API call performance
  async measureApiCall<T>(endpoint: string, apiCall: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const result = await apiCall()
      const end = performance.now()
      const duration = end - start
      
      this.metrics.set(`api_${endpoint}`, duration)
      
      if (duration > 1000) {
        console.warn(`Slow API call: ${endpoint} took ${duration.toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      const end = performance.now()
      const duration = end - start
      this.metrics.set(`api_error_${endpoint}`, duration)
      throw error
    }
  }

  // Get Core Web Vitals
  getCoreWebVitals() {
    if (typeof window === 'undefined') return null

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    return {
      // Largest Contentful Paint
      lcp: this.getLCP(),
      // First Input Delay
      fid: this.getFID(),
      // Cumulative Layout Shift
      cls: this.getCLS(),
      // Time to First Byte
      ttfb: navigation.responseStart - navigation.requestStart,
      // Dom Content Loaded
      dcl: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      // Load Complete
      load: navigation.loadEventEnd - navigation.navigationStart,
    }
  }

  private getLCP(): number | null {
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
    return lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : null
  }

  private getFID(): number | null {
    const fidEntries = performance.getEntriesByType('first-input')
    return fidEntries.length > 0 ? fidEntries[0].processingStart - fidEntries[0].startTime : null
  }

  private getCLS(): number {
    let cls = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          cls += (entry as any).value
        }
      }
    })
    observer.observe({ type: 'layout-shift', buffered: true })
    return cls
  }

  // Report metrics to analytics
  reportMetrics() {
    const webVitals = this.getCoreWebVitals()
    
    if (webVitals && process.env.NODE_ENV === 'production') {
      // Send to analytics service
      console.log('Web Vitals:', webVitals)
      
      // Example: Send to Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'web_vitals', {
          lcp: webVitals.lcp,
          fid: webVitals.fid,
          cls: webVitals.cls,
          ttfb: webVitals.ttfb,
        })
      }
    }
  }

  // Memory usage monitoring
  getMemoryUsage() {
    if (typeof window === 'undefined' || !(performance as any).memory) return null
    
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
    }
  }

  // Bundle size monitoring
  getBundleSize() {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    const scripts = resources.filter(r => r.name.includes('.js') || r.name.includes('.mjs'))
    const styles = resources.filter(r => r.name.includes('.css'))
    
    const totalScriptSize = scripts.reduce((acc, script) => acc + (script.transferSize || 0), 0)
    const totalStyleSize = styles.reduce((acc, style) => acc + (style.transferSize || 0), 0)
    
    return {
      scripts: Math.round(totalScriptSize / 1024), // KB
      styles: Math.round(totalStyleSize / 1024), // KB
      total: Math.round((totalScriptSize + totalStyleSize) / 1024), // KB
    }
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance()

  const measureComponent = (componentName: string) => {
    return {
      start: () => performance.now(),
      end: (startTime: number) => {
        const duration = performance.now() - startTime
        monitor.measureRender(componentName, () => {})
        return duration
      }
    }
  }

  return {
    measureComponent,
    measureApiCall: monitor.measureApiCall.bind(monitor),
    getCoreWebVitals: monitor.getCoreWebVitals.bind(monitor),
    getMemoryUsage: monitor.getMemoryUsage.bind(monitor),
    getBundleSize: monitor.getBundleSize.bind(monitor),
    reportMetrics: monitor.reportMetrics.bind(monitor),
  }
}

// Image optimization utilities
export const imageOptimization = {
  // Generate responsive image sizes
  generateSizes: (maxWidth: number) => {
    const breakpoints = [640, 768, 1024, 1280, 1536]
    return breakpoints
      .filter(bp => bp <= maxWidth)
      .map(bp => `(max-width: ${bp}px) ${bp}px`)
      .concat(`${maxWidth}px`)
      .join(', ')
  },

  // Preload critical images
  preloadImage: (src: string, priority: 'high' | 'low' = 'low') => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high')
    }
    document.head.appendChild(link)
  },

  // Lazy load images with intersection observer
  lazyLoadImage: (img: HTMLImageElement, src: string) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src
          img.classList.remove('opacity-0')
          img.classList.add('opacity-100')
          observer.unobserve(img)
        }
      })
    }, { threshold: 0.1 })

    observer.observe(img)
  }
}

// Export performance instance
export const performanceMonitor = PerformanceMonitor.getInstance()