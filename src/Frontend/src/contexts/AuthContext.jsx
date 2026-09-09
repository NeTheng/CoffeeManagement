import React, { createContext, useContext, useState } from 'react';
import { getToken, removeToken, setToken, getUsername, getRole } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(getToken());
  const [username, setUsername] = useState(getUsername());
  const [role, setRole] = useState(getRole());

  const logout = () => {
    removeToken();
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('rememberMe');
    setAuthToken(null);
    setUsername(null);
    setRole(null);
  };

  const login = (newToken, newUsername, newRole) => {
    setToken(newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('role', newRole);
    setAuthToken(newToken);
    setUsername(newUsername);
    setRole(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        role,
        isAuthenticated: !!token,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
