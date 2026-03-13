# Stage 1: Build
# Inclui python3/make/g++ para compilar bcrypt (módulo nativo)
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
# Copia node_modules inteiro do builder para manter binários nativos
# e ter acesso à CLI do Prisma (devDependency) para migrate deploy
FROM node:22-alpine AS production
WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

EXPOSE 3001
CMD ["sh", "-c", "node node_modules/.bin/prisma migrate deploy && node dist/main"]
