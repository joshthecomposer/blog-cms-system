// import { useState, useEffect } from "react";

// function getSavedValue(key: string, initialValue: any) {
//   const item = localStorage.getItem(key);
//   if (item === null) {
//     if (initialValue instanceof Function) return initialValue();
//     return initialValue;
//   }

//   try {
//     const savedValue = JSON.parse(item);
//     return savedValue;
//   } catch (error) {
//     console.error(`Error parsing local storage key “${key}”:`, error);
//     return initialValue;
//   }
// }


// export default function useLocalStorage(key : any, initialValue : any) {
//   const [value, setValue] = useState(() => {
//     return getSavedValue(key, initialValue);
//   })

//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(value))
//   }, [key, value])

//   return [value, setValue]
// }

import { useState, useEffect } from 'react';

function useLocalStorage(key : any, initialValue : any) {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value : any) => {
    if (typeof window === 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`,
      );
    }

    try {
      // Allow value to be a function so we have same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value;

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(newValue));

      // Save state
      setStoredValue(newValue);

      // We dispatch a custom event so every useStorage hook are notified
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  // Read latest value from LocalStorage in case it was
  // updated in a different instance of this hook
  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  // Keep all instances of the hook synchronized
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // Event listener to run every time a 'storage' event is fired
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    // Clean up event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
}

export default useLocalStorage;
