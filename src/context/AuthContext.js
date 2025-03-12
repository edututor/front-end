import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const storedData = authService.getCurrentUser();
    if (storedData && storedData.user) {
      setUser(storedData.user);
    }
    setLoading(false); // Mark loading as done after check
  }, []);

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
