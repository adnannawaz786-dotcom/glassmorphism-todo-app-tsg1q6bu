/* EXPORTS: useLocalStorage */

import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  // Initialize state with initialValue to prevent SSR issues
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage after component mounts (client-side only)
  useEffect(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none keep initialValue
      const value = item ? JSON.parse(item) : initialValue;
      setStoredValue(value);
      setIsInitialized(true);
    } catch (error) {
      // If error keep initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      setIsInitialized(true);
    }
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage (only on client-side)
      if (typeof window !== 'undefined') {
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to the localStorage key from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.storageArea === localStorage) {
        try {
          // Use null when localStorage is cleared, not initialValue
          const newValue = e.newValue ? JSON.parse(e.newValue) : null;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};

export { useLocalStorage };