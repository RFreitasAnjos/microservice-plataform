/**
 * Auth Types - HttpOnly Cookie Security
 * 
 * Define tipos para autenticação com HttpOnly cookies
 */

/**
 * Resposta de autenticação do Keycloak
 */
export interface KeycloakAuthResponse {
  token: string;
  refreshToken: string;
  idToken?: string;
  expiresIn: number;
}

/**
 * Payload do JWT decodificado
 */
export interface JwtPayload {
  sub: string; // User ID
  preferred_username: string;
  email?: string;
  name?: string;
  exp: number;
  iat: number;
}

/**
 * Request para salvar token em HttpOnly cookie
 */
export interface SetTokenRequest {
  token: string;
}

/**
 * Contexto de autenticação
 */
export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
  loading: boolean;
}

/**
 * Configuração de cookie HttpOnly
 * 
 * Atributos de segurança:
 * - httpOnly: true - Não acessível a JavaScript (XSS protection)
 * - secure: true - Apenas HTTPS em produção
 * - sameSite: 'strict' - Proteção contra CSRF
 */
export interface HttpOnlyCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge: number;
}

/**
 * Constantes de segurança
 */
export const AUTH_CONSTANTS = {
  COOKIE_NAME: 'auth_token',
  COOKIE_MAX_AGE: 24 * 60 * 60 * 1000, // 24 horas
  TOKEN_REFRESH_INTERVAL: 60 * 1000, // 60 segundos
  API_ENDPOINTS: {
    SET_TOKEN: '/auth/set-token',
    LOGOUT: '/auth/logout',
    HEALTH: '/auth/health',
  },
} as const;

/**
 * Erro de autenticação
 */
export class AuthenticationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
