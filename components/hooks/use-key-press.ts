import { useEffect, useState, useCallback } from 'react';

/**
 * A custom hook for detecting when specific keyboard keys are pressed.
 * 
 * @param targetKey A string or array of strings representing the keys to detect
 * @returns boolean Whether any of the target keys are currently pressed
 * 
 * @example
 * // Detect when the Escape key is pressed
 * const isEscPressed = useKeyPress('Escape');
 * 
 * @example
 * // Detect when either the Enter or Space key is pressed
 * const isConfirmPressed = useKeyPress(['Enter', ' ']);
 */
export function useKeyPress(targetKey: string | string[]): boolean {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);
  
  // Convert single key to array for consistent handling
  const keys = Array.isArray(targetKey) ? targetKey : [targetKey];

  // If pressed key is our target key then set to true
  const downHandler = useCallback(
    (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        setKeyPressed(true);
      }
    },
    [keys]
  );

  // If released key is our target key then set to false
  const upHandler = useCallback(
    (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        setKeyPressed(false);
      }
    },
    [keys]
  );

  // Add event listeners
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler]); // Only re-run if handlers change

  return keyPressed;
}