'use client';

import { useAuthContext } from '@/app/providers/AuthContext';
import { useMemo } from 'react';

export function useAuth() {
  const { token, isAuthenticated, user, setToken, logout, loading } = useAuthContext();

  // Retorna um objeto memoizado para evitar re-renders desnecessários
  return useMemo(
    () => ({
      token,
      isAuthenticated,
      user,
      setToken,
      logout,
      loading,
    }),
    [token, isAuthenticated, user, setToken, logout, loading]
  );
}
