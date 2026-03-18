FROM node:20-alpine AS builder

WORKDIR /app

# Copia dependências primeiro (cache)
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Generate Prisma CLient (with dummy DATABASE_URL for schema generation)
RUN DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy" npx prisma generate

#Build do Nestjs
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Copia apenas o necessário
COPY package*.json ./
RUN npm install --omit=dev

# Copia build gerado
COPY --from=builder /app/dist ./dist

# Copia Prisma gerado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Porta do serviço
EXPOSE 3001

# Start da aplicação
CMD ["node", "dist/src/main.js"]