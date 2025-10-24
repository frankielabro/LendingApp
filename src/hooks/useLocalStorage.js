import { useState, useEffect } from 'react';

// This function gets an item from localStorage
function getStorageValue(key, defaultValue) {
  // Check if we are in a browser
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    // Check if there was anything saved
    if (saved !== null) {
      return JSON.parse(saved);
    }
  }
  // If nothing was saved, return the default
  return defaultValue;
}

// This is our new hook!
export function useLocalStorage(key, defaultValue) {
  // We use useState to hold the current value
  // We initialize it by calling our function above
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  // This useEffect hook will run every time 'value' changes
  useEffect(() => {
    // We save the new value to localStorage
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]); // The "dependency array"

  // We return the value and the function to change it, just like useState
  return [value, setValue];
}