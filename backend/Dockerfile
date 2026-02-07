# ===========================================
# Backend Dockerfile - Multi-stage build
# ===========================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files del monorepo
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY packages/dicelogic/package*.json ./packages/dicelogic/

# Copiar el paquete dicelogic primero (dependencia local)
COPY packages/dicelogic ./packages/dicelogic

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm install

# Copiar codigo fuente del backend
COPY backend/ ./

# Copiar tsconfig y compilar TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar package files
COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/packages ./packages

# Instalar solo dependencias de produccion
RUN npm install --omit=dev

# Copiar codigo compilado
COPY --from=builder /app/backend/dist ./dist

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Comando de inicio
CMD ["node", "dist/backend/index.js"]
