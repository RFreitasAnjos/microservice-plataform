# Gateway da Plataforma de Microserviços

Este diretório contém o gateway NestJS que faz a ponte entre o frontend Next.js, o Keycloak e o `user-service`.

O foco deste projeto é autenticação segura com cookies HttpOnly e proxy para os serviços internos da plataforma.

## Visão geral

O gateway centraliza três responsabilidades:

1. autenticar o usuário via Keycloak
2. armazenar o JWT em cookie HttpOnly no navegador
3. repassar requisições autenticadas para o `user-service`

O frontend não lê o cookie diretamente. Em vez disso, ele consulta `GET /auth/me` para validar a sessão atual.

## Fluxo de autenticação

### 1. Acesso ao login

No frontend, a rota [frontend/app/auth/login/page.tsx](../frontend/app/auth/login/page.tsx) redireciona o usuário para o gateway em `/auth/login`.

O gateway monta a URL de autorização do Keycloak com base nas variáveis:

- `KEYCLOAK_PUBLIC_URL` ou `KEYCLOAK_URL`
- `KEYCLOAK_REALM`
- `KEYCLOAK_LOGIN_CLIENT_ID` ou `KEYCLOAK_CLIENT_ID`
- `KEYCLOAK_LOGIN_REDIRECT_URI` ou `CORS_ORIGIN`

### 2. Token no cookie HttpOnly

Depois do login no Keycloak, o frontend recebe o token em memória e chama `POST /auth/set-token` com o corpo:

```json
{ "token": "eyJhbGc..." }
```

O gateway grava esse token no cookie `auth_token` com as seguintes proteções:

- `HttpOnly`
- `Secure` em produção
- `SameSite=Strict`
- `path=/`
- expiração de 24 horas

### 3. Validação de sessão no frontend

Ao subir, o frontend executa [frontend/app/providers/AuthContext.tsx](../frontend/app/providers/AuthContext.tsx) e chama `GET /auth/me`.

Se o endpoint responder com `authenticated: true`:

- o estado global é marcado como autenticado
- os dados do usuário são carregados
- o usuário pode navegar para áreas privadas, como `/profile`

### 4. Renovação de token

O [frontend/app/providers/KeycloakProvider.tsx](../frontend/app/providers/KeycloakProvider.tsx) carrega o `keycloak.js` dinamicamente, faz `check-sso` e mantém uma rotina de renovação.

Quando o token é renovado:

- o frontend chama novamente `POST /auth/set-token`
- o cookie HttpOnly é atualizado no backend
- a sessão continua válida sem expor o token em `localStorage`

### 5. Logout

O logout chama `POST /auth/logout`, que apaga o cookie `auth_token` imediatamente.

## Frontend

O frontend da plataforma está em [../frontend](../frontend) e usa Next.js com App Router.

### Comportamento principal

- a home pública apresenta a plataforma e o botão de login
- a rota `/auth/login` apenas redireciona para o gateway
- o `AuthProvider` verifica a sessão ao carregar a aplicação
- o `KeycloakProvider` sincroniza o token com o gateway
- as rotas privadas bloqueiam acesso quando não há sessão válida

### Rotas principais do frontend

- `/` - home pública
- `/auth/login` - redirecionamento para autenticação
- `/dashboard` - área autenticada
- `/profile` - perfil do usuário
- `/search` - busca protegida
- `/settings` - configurações protegidas
- `/onboarding` - fluxo inicial autenticado

### Cliente HTTP do frontend

O frontend usa [frontend/app/services/api.ts](../frontend/app/services/api.ts) para manter um singleton Axios.

Esse cliente:

- injeta `Authorization: Bearer <token>` quando o token está em memória
- usa `credentials: include` quando o browser precisa enviar cookies ao gateway
- não depende de `localStorage` para controlar autenticação

## Endpoints do gateway

### Autenticação

- `GET /auth/login` - redireciona para o Keycloak
- `POST /auth/set-token` - salva o JWT no cookie HttpOnly
- `POST /auth/logout` - limpa a sessão
- `GET /auth/me` - valida a sessão atual e retorna dados básicos do usuário
- `POST /auth/health` - health check de autenticação

### Proxy de usuários

As rotas em `/api/users` encaminham chamadas para o `user-service`.

- `POST /api/users` - criação pública de usuário
- `GET /api/users/health/check` - health check público
- `GET /api/users` - lista usuários autenticado
- `GET /api/users/:id` - obtém usuário por id autenticado
- `PATCH /api/users/:id` - atualiza usuário autenticado
- `DELETE /api/users/:id` - remove usuário autenticado
- `DELETE /api/users/:id/permanent` - remoção definitiva autenticada
- `PATCH /api/users/password/:id` - troca senha autenticada

As rotas protegidas exigem JWT e encaminham o cabeçalho `Authorization` para o serviço de destino.

## Segurança HttpOnly

As regras implementadas seguem a documentação em [AUTH-HTTPONLY-SECURITY.md](AUTH-HTTPONLY-SECURITY.md).

### O que está ativo

- token fora de `localStorage`
- cookie HttpOnly para impedir acesso via JavaScript
- `Secure` em produção para restringir o cookie a HTTPS
- `SameSite=Strict` para reduzir risco de CSRF
- CORS com `credentials: true`
- `Set-Cookie` exposto para o frontend poder confirmar o fluxo de autenticação
- `cookie-parser` habilitado no NestJS

### Como o backend lê o token

O JWT strategy tenta extrair o token nesta ordem:

1. cookie `auth_token`
2. header `Authorization: Bearer ...`

Isso permite que o frontend autentique tanto via cookie quanto em chamadas que ainda usem o bearer token em memória.

## Configuração

### Variáveis de ambiente do gateway

Arquivo: [.env](.env)

Variáveis mais importantes:

- `PORT`
- `NODE_ENV`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `USER_SERVICE_URL`
- `KEYCLOAK_URL`
- `KEYCLOAK_PUBLIC_URL`
- `KEYCLOAK_REALM`
- `KEYCLOAK_CLIENT_ID`
- `KEYCLOAK_LOGIN_CLIENT_ID`
- `KEYCLOAK_LOGIN_REDIRECT_URI`

### Valores padrão observados no código

- porta padrão do gateway: `3000`
- origem padrão do frontend: `http://localhost:4000`
- serviço de usuários padrão: `http://user-service:3001`

## Como rodar localmente

### Instalar dependências

```bash
npm install
```

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

### Testes

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Estrutura principal

- [src/main.ts](src/main.ts) - inicialização, CORS e `cookie-parser`
- [src/auth/auth.controller.ts](src/auth/auth.controller.ts) - login, logout, set-token e me
- [src/auth/strategies/jwt.strategy.ts](src/auth/strategies/jwt.strategy.ts) - leitura do JWT via cookie ou header
- [src/users-proxy/users-proxy.controller.ts](src/users-proxy/users-proxy.controller.ts) - rotas proxy de usuários
- [src/proxy/proxy.service.ts](src/proxy/proxy.service.ts) - cliente HTTP para o `user-service`

## Troubleshooting

### O login redireciona para endereço errado do Keycloak

Verifique se o navegador consegue acessar a URL configurada em `KEYCLOAK_PUBLIC_URL`.

### A sessão não permanece após o login

Confira se:

- o endpoint `POST /auth/set-token` está sendo chamado com `credentials: include`
- o cookie `auth_token` está sendo criado no navegador
- `CORS_ORIGIN` está alinhado com a URL do frontend
- `NODE_ENV` está correto para ativar `Secure` apenas em produção

### `GET /auth/me` retorna 401

Possíveis causas:

- o cookie expirou
- o token foi removido em `POST /auth/logout`
- o `JWT_SECRET` não confere com o token assinado

### Rotas de usuários falham com autorização

Confirme se o frontend está enviando o bearer token em memória ou se o cookie foi sincronizado corretamente com o gateway.

## Observação

Este README foi reescrito para documentar o comportamento real do gateway e a integração com o frontend, sem depender do README padrão do NestJS.
