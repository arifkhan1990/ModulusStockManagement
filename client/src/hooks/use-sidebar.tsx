
import { useState, useEffect } from 'react';

// Define sidebar state management hook
export function useSidebar() {
  const [isOpen, setIsOpen] = useState(() => {
    // Load user preference from localStorage if available
    const saved = localStorage.getItem('sidebar-state');
    return saved ? saved === 'open' : window.innerWidth > 1024;
  });

  // Save preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('sidebar-state', isOpen ? 'open' : 'closed');
  }, [isOpen]);

  // Toggle sidebar state
  const toggle = () => setIsOpen(!isOpen);

  return {
    isOpen,
    setIsOpen,
    toggle
  };
}
