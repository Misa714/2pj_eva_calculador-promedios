# Etapa 1: Instalar solo dependencias de producción
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Etapa 2: Imagen final ligera
FROM node:18-alpine
# ---> INSTALAMOS TINI PARA MANEJAR EL CTRL+C EN ALPINE <---
RUN apk add --no-cache tini
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000

# Usamos tini como el punto de entrada principal
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "app.js"]