'use client';

import React, { useEffect, ReactNode } from 'react';
import { useAuthContext } from './AuthContext';
import { initializeApi } from '@/app/services/api';
import { usePathname, useRouter } from 'next/navigation';

declare global {
  interface Window {
    Keycloak: any;
  }
}

interface KeycloakProviderProps {
  children: ReactNode;
}

let lastSyncedToken: string | null = null;

export function KeycloakProvider({ children }: KeycloakProviderProps) {
  const { setToken } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/auth/login') {
      initializeApi(() => null);
      return;
    }

    let tokenRefreshInterval: ReturnType<typeof setInterval> | undefined;
    let isMounted = true;

    const initKeycloak = async () => {
      if (typeof window === 'undefined') return;

      try {
        const script = document.createElement('script');
        script.src = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/js/keycloak.js`;
        script.async = true;
        script.type = 'application/javascript';

        script.onerror = () => {
          console.error('Falha ao carregar Keycloak.js');
        };

        script.onload = async () => {
          if (!isMounted) return;

          if (!window.Keycloak) {
            console.error('Keycloak não foi definido no window');
            return;
          }

          try {
            const keycloak = new window.Keycloak({
              url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
              realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
              clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
            });

            const authenticated = await keycloak.init({
              onLoad: 'check-sso',
              checkLoginIframe: false,
              silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
              pkceMethod: 'S256',
            });

            if (authenticated && keycloak.token) {
              try {
                const gatewayUrl =
                  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
                const baseUrl = gatewayUrl.replace('/api', '');

                if (lastSyncedToken === keycloak.token) {
                  setToken(keycloak.token);
                  initializeApi(() => keycloak.token);
                  return;
                }

                const response = await fetch(`${baseUrl}/auth/set-token`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include', // Permite cookies
                  body: JSON.stringify({ token: keycloak.token }),
                });

                if (!response.ok) {
                  throw new Error('Falha ao salvar token no servidor');
                }

                setToken(keycloak.token);
                initializeApi(() => keycloak.token);
                lastSyncedToken = keycloak.token;

                router.replace('/profile');

                tokenRefreshInterval = setInterval(() => {
                  keycloak
                    .refreshToken(30)
                    .then((refreshed: boolean) => {
                      if (refreshed) {
                        fetch(`${baseUrl}/auth/set-token`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          credentials: 'include',
                          body: JSON.stringify({ token: keycloak.token }),
                        }).catch((error) => {
                          console.error('Erro ao renovar token Server:', error);
                        });
                        lastSyncedToken = keycloak.token;
                      }
                    })
                    .catch((error: any) => {
                      console.error('Erro ao renovar token:', error);
                      if (tokenRefreshInterval) {
                        clearInterval(tokenRefreshInterval);
                      }
                      keycloak.logout();
                    });
                }, 60000);
              } catch (error) {
                console.error('Erro ao salvar token no servidor:', error);
                initializeApi(() => keycloak.token);
              }
            } else {
              initializeApi(() => null);
            }
          } catch (error) {
            console.error('Erro ao initializar Keycloak:', error);
          }
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Erro durante setup do Keycloak:', error);
      }
    };

    initKeycloak();

    return () => {
      isMounted = false;

      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
    };
  }, [pathname, router, setToken]);

  return <>{children}</>;
}