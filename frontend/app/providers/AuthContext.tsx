'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getApi, initializeApi } from '@/app/services/api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: any;
  setToken: (token: string | null) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        initializeApi(() => null);
        const api = getApi();
        const response = await api.get('/auth/me');
        
        if (response.data?.authenticated) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          setTokenState(null);
        }
      } catch (error: any) {
        console.log('Usuário não autenticado:', error?.message);
        setIsAuthenticated(false);
        setTokenState(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      setTokenState(newToken);
      setIsAuthenticated(true);
    } else {
      logout();
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const api = getApi();
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, user, setToken, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  }
  return context;
}