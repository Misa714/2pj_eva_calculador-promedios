# Etapa 1: Instalar dependencias
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Etapa 2: Imagen final con Tini para atrapar el Ctrl+C
FROM node:18-alpine
RUN apk add --no-cache tini
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "app.js"]