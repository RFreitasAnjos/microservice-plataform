# ---------- BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Args vindos do docker-compose
ARG NEXT_PUBLIC_KEYCLOAK_URL
ARG NEXT_PUBLIC_KEYCLOAK_REALM
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL

# Define como variáveis de ambiente no build
ENV NEXT_PUBLIC_KEYCLOAK_URL=$NEXT_PUBLIC_KEYCLOAK_URL
ENV NEXT_PUBLIC_KEYCLOAK_REALM=$NEXT_PUBLIC_KEYCLOAK_REALM
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=$NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

COPY package*.json ./
RUN npm install

COPY . .

# Build do Next
RUN npm run build


# ---------- PRODUCTION ----------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install 
# Copy node_modules from builder (includes dev dependencies for TypeScript)
# This is necessary because Next.js needs TypeScript to transpile next.config.ts
COPY --from=builder /app/node_modules ./node_modules

# Copia build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

EXPOSE 4000

CMD ["npm", "start"]