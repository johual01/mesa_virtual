# ===========================================
# Frontend Dockerfile - Multi-stage build (Next.js)
# ===========================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar package files del monorepo
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY packages/dicelogic/package*.json ./packages/dicelogic/

# Copiar el paquete dicelogic primero (dependencia local)
COPY packages/dicelogic ./packages/dicelogic

# Instalar dependencias del frontend
WORKDIR /app/frontend
RUN npm install

# Stage 2: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/packages ./packages

# Copiar codigo fuente del frontend
COPY frontend/ ./frontend/

# Build arguments para variables de entorno en build time
ARG NEXT_PUBLIC_URL_API
ARG NEXT_PUBLIC_BASE_PATH=""

# Setear variables de entorno para el build
ENV NEXT_PUBLIC_URL_API=${NEXT_PUBLIC_URL_API}
ENV NEXT_PUBLIC_BASE_PATH=${NEXT_PUBLIC_BASE_PATH}
ENV NEXT_TELEMETRY_DISABLED=1

# Build de Next.js
WORKDIR /app/frontend
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Setear variables de entorno para produccion
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar archivos necesarios para produccion
COPY --from=builder /app/frontend/public ./public

# Copiar el standalone build y archivos estaticos
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno runtime
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando de inicio
CMD ["node", "server.js"]
