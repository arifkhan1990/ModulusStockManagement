import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Assuming an AuthContext exists

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data from local storage or API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // Simulate API call for authentication
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setIsAuthenticated(true);
      setIsLoading(false);
      // Redirect to dashboard if on home or auth page
      if (window.location.pathname === "/" || window.location.pathname === "/auth") {
        window.location.href = "/dashboard";
      }

    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      // Handle login error (e.g., display an error message)
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };


  const value = { user, isAuthenticated, isLoading, login, logout };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;