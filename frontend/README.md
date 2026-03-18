# Microservices Platform Frontend

Frontend da plataforma de microserviços construído com Next.js, React, TypeScript, Keycloak e integração com gateway NestJS usando cookies HttpOnly.

## Visão geral

Este frontend é a camada de entrada da plataforma:

- a home pública apresenta a solução e o CTA de acesso
- o login redireciona para o gateway em `/auth/login`
- o gateway redireciona para o Keycloak
- após autenticação, o token é salvo em cookie HttpOnly no backend
- o frontend valida a sessão usando `GET /auth/me`
- as rotas privadas são liberadas somente quando a sessão é válida

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript
- Axios
- keycloak-js
- CSS Modules

## Como o fluxo funciona

### 1. Home pública

A página inicial em [app/page.tsx](app/page.tsx) funciona como landing page pública:

- explica a plataforma
- mostra os recursos principais
- oferece o botão de login
- não exige autenticação para ser visualizada

### 2. Login

O botão de login leva para [app/auth/login/page.tsx](app/auth/login/page.tsx), que faz apenas o redirect para o gateway:

```text
frontend -> gateway /auth/login -> Keycloak
```

O gateway monta a URL de autorização com as variáveis:

- `KEYCLOAK_PUBLIC_URL`
- `KEYCLOAK_REALM`
- `KEYCLOAK_LOGIN_CLIENT_ID`
- `KEYCLOAK_LOGIN_REDIRECT_URI`

### 3. Persistência da sessão

Após o login no Keycloak:

- o frontend envia o token ao gateway em `POST /auth/set-token`
- o gateway grava `auth_token` em cookie HttpOnly
- o token não fica em `localStorage`
- o backend passa a ser a fonte de verdade da sessão

### 4. Validação da sessão

O frontend usa o `AuthContext` para consultar `GET /auth/me` no gateway.

Se o backend responder com `authenticated: true`:

- o estado global é marcado como autenticado
- a navegação privada é liberada
- o usuário segue para `/profile`

## Rotas do frontend

As rotas principais estão centralizadas em [app/constants/index.ts](app/constants/index.ts):

- `/` - home pública
- `/auth/login` - redirecionamento para login
- `/dashboard` - área autenticada
- `/profile` - perfil e hub de acesso privado
- `/search` - busca protegida
- `/settings` - configurações protegidas
- `/onboarding` - onboarding protegido

## Componentes centrais

### Root layout

[app/layout.tsx](app/layout.tsx) envolve a aplicação com:

- `AuthProvider`
- `KeycloakProvider`

### AuthProvider

[app/providers/AuthContext.tsx](app/providers/AuthContext.tsx):

- inicializa a API com Axios
- consulta `/auth/me` ao montar
- expõe `isAuthenticated`, `user`, `loading`, `logout` e `setToken`
- mantém o estado da sessão em memória

### KeycloakProvider

[app/providers/KeycloakProvider.tsx](app/providers/KeycloakProvider.tsx):

- carrega o script do Keycloak dinamicamente
- executa `check-sso`
- sincroniza o token com o gateway
- renova o token periodicamente
- não roda na rota `/auth/login`

### API client

[app/services/api.ts](app/services/api.ts):

- cria um singleton Axios
- injeta `Authorization: Bearer <token>` quando existe token em memória
- mantém chamadas prontas para o gateway

## Áreas privadas

As páginas privadas usam `useAuth()` para bloquear acesso quando não autenticadas:

- [app/dashboard/page.tsx](app/dashboard/page.tsx)
- [app/profile/page.tsx](app/profile/page.tsx)
- [app/search/page.tsx](app/search/page.tsx)
- [app/settings/page.tsx](app/settings/page.tsx)
- [app/onboarding/page.tsx](app/onboarding/page.tsx)

Padrão aplicado:

- enquanto carrega, exibe spinner
- se não autenticado, redireciona para `/`
- se autenticado, libera a área privada

## Segurança HttpOnly

As regras de segurança estão detalhadas em [HTTPONLY-COOKIES-SECURITY.md](HTTPONLY-COOKIES-SECURITY.md).

### O que foi implementado

- token não é armazenado em `localStorage`
- token não é armazenado em `sessionStorage`
- sessão protegida por cookie HttpOnly
- `SameSite=Strict` para reduzir risco de CSRF
- `Secure` em produção
- renovação periódica do token

### Fluxo de segurança

```text
Keycloak -> frontend recebe token em memória
frontend -> gateway POST /auth/set-token
gateway -> grava auth_token em HttpOnly cookie
frontend -> usa /auth/me para validar sessão
```

### Benefícios

- reduz risco de XSS sobre o token da sessão
- o cookie é enviado automaticamente pelo navegador
- o frontend não precisa ler o cookie
- a autenticação fica centralizada no backend

## Variáveis de ambiente

### Frontend

Arquivo: `.env.local`

```bash
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=master
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:4000
```

### Observação importante

`NEXT_PUBLIC_KEYCLOAK_URL` precisa apontar para uma URL acessível pelo navegador. Não use `http://keycloak:8080` no frontend, porque esse host só existe dentro da rede Docker.

## Dependências do backend

Este frontend depende de:

- gateway em `http://localhost:3000`
- Keycloak em `http://localhost:8080`
- `GET /auth/me`
- `POST /auth/set-token`
- `POST /auth/logout`

No ambiente Docker:

- `http://keycloak:8080` pode ser usado internamente pelo backend
- `http://localhost:8080` deve ser usado pelo navegador

## Setup local

### 1. Instale dependências

```bash
cd frontend
npm install
```

### 2. Configure variáveis

Revise o arquivo `.env.local` se necessário.

### 3. Inicie a infraestrutura

```bash
cd infrastructure
docker compose up -d
```

### 4. Rode o frontend

```bash
cd frontend
npm run dev
```

Abra:

- http://localhost:4000

## Scripts

Definidos em [package.json](package.json):

- `npm run dev` - desenvolvimento na porta 4000
- `npm run build` - build de produção
- `npm run start` - executa a build na porta 4000
- `npm run lint` - ESLint

## Troubleshooting

### DNS_PROBE_FINISHED_NXDOMAIN ao abrir login

Isso significa que o navegador recebeu `http://keycloak:8080/...`.

Correção:

- use `KEYCLOAK_PUBLIC_URL=http://localhost:8080` no gateway
- use `NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080` no frontend

### Rota de login incorreta

Confirme:

- `KEYCLOAK_REALM=master`
- `NEXT_PUBLIC_KEYCLOAK_REALM=master`
- `KEYCLOAK_LOGIN_CLIENT_ID=frontend`
- `KEYCLOAK_LOGIN_REDIRECT_URI=http://localhost:4000`

### Perfil não carrega após login

Verifique:

- se o cookie `auth_token` foi criado pelo gateway
- se `GET /auth/me` responde com `authenticated: true`
- se frontend, gateway e Keycloak estão apontando para a mesma instância

## Estrutura relevante

- [app/page.tsx](app/page.tsx) - landing pública
- [app/auth/login/page.tsx](app/auth/login/page.tsx) - redirect para login
- [app/providers/AuthContext.tsx](app/providers/AuthContext.tsx) - estado global de autenticação
- [app/providers/KeycloakProvider.tsx](app/providers/KeycloakProvider.tsx) - bootstrap de sessão
- [app/services/api.ts](app/services/api.ts) - cliente HTTP
- [components/layouts/AppLayout.tsx](components/layouts/AppLayout.tsx) - layout autenticado
- [components/layouts/AuthLayout.tsx](components/layouts/AuthLayout.tsx) - layout de autenticação
- [components/ui/Navbar.tsx](components/ui/Navbar.tsx) - navegação principal
- [components/ui/Footer.tsx](components/ui/Footer.tsx) - rodapé

## Próximos passos sugeridos

- sincronizar a documentação do gateway com este README
- incluir um diagrama de autenticação no README
- adicionar capturas de tela da home e das áreas privadas quando o fluxo estiver estabilizado
