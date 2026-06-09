# =========================================================
# ETAPA 1: Instalar dependencias de producción de forma limpia
# =========================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# --ignore-scripts evita que Node intente ejecutar Husky en el contenedor, solucionando el error 127.
RUN npm ci --omit=dev --ignore-scripts

# =========================================================
# ETAPA 2: Imagen final optimizada y ultra ligera
# =========================================================
FROM node:20-alpine

RUN apk add --no-cache tini

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "index.js"]