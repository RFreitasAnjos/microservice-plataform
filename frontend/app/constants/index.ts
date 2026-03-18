// Rotas da aplicação
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SEARCH: '/search',
  SETTINGS: '/settings',
  ONBOARDING: '/onboarding',
} as const;

// Mensagens de erro comuns
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Você não está autenticado. Faça login para continuar.',
  FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
  NOT_FOUND: 'O recurso solicitado não foi encontrado.',
  INTERNAL_ERROR: 'Erro interno do servidor. Tente novamente mais tarde.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
} as const;

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  SETTINGS_SAVED: 'Configurações salvas com sucesso!',
} as const;

// Timeouts
export const TIMEOUTS = {
  AUTH_CHECK: 5000, // 5 segundos
  API_REQUEST: 10000, // 10 segundos
  TOAST_MESSAGE: 3000, // 3 segundos
} as const;

// Limites
export const LIMITS = {
  ITEMS_PER_PAGE: 10,
  MAX_PASSWORD_LENGTH: 128,
  MIN_PASSWORD_LENGTH: 8,
} as const;
