import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * Hook to initialize authentication state from localStorage
 * Call this in your root App component
 */
export const useAuthInit = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);
};

