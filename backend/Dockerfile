# ===========================================
# Backend Dockerfile - Multi-stage build
# ===========================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files del monorepo
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY packages/diceLogic/package*.json ./packages/diceLogic/

# Copiar el paquete diceLogic primero (dependencia local)
COPY packages/diceLogic ./packages/diceLogic

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm install

# Copiar codigo fuente del backend
COPY backend/ ./

# Copiar tsconfig y compilar TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app/backend

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar package files manteniendo estructura relativa para file:../packages
COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/packages ../packages

# Instalar solo dependencias de produccion
RUN npm install --omit=dev

# Copiar codigo compilado
COPY --from=builder /app/backend/dist ./dist

# Permitir escritura para generar .env en runtime
RUN chown -R nodejs:nodejs /app/backend /app/packages && \
    printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    'cat > /app/backend/.env <<EOF' \
    'MONGO_DB=${MONGO_DB}' \
    'SECRET=${SECRET}' \
    'REFRESH_SECRET=${REFRESH_SECRET}' \
    'ENDPOINT_MINIO=${ENDPOINT_MINIO}' \
    'PORT_MINIO=${PORT_MINIO}' \
    'ACCESS_KEY_MINIO=${ACCESS_KEY_MINIO}' \
    'SECRET_KEY_MINIO=${SECRET_KEY_MINIO}' \
    'GENERIC_BUCKET_NAME=${GENERIC_BUCKET_NAME}' \
    'SMTP_HOSTNAME=${SMTP_HOSTNAME}' \
    'SMTP_PORT=${SMTP_PORT}' \
    'SMTP_USERNAME=${SMTP_USERNAME}' \
    'SMTP_PASSWORD=${SMTP_PASSWORD}' \
    'PORT=${PORT}' \
    'URL=${URL}' \
    'FRONTEND_URL=${FRONTEND_URL}' \
    'GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}' \
    'MINIO_USE_SSL=${MINIO_USE_SSL}' \
    'EOF' \
    'exec node dist/backend/index.js' \
    > /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Comando de inicio
CMD ["/usr/local/bin/docker-entrypoint.sh"]
