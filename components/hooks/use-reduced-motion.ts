import { useEffect, useState } from 'react';

/**
 * A custom hook that detects if the user has requested reduced motion.
 * This allows components to respect user's motion preferences.
 * 
 * @returns boolean - True if the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  // Default to false (animations enabled) when SSR
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Create the media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set the initial value
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Define a callback to handle changes to the media query
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    // Add the callback as a listener for changes to the media query
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);
  
  return prefersReducedMotion;
}