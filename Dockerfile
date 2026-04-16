# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos package.json y lock para aprovechar el cache de Docker
COPY package*.json ./

# Instalamos todas las dependencias (incluyendo dev) para el build
RUN npm install

# Copiamos el código fuente
COPY . .

# Generamos el build de NestJS (dist/)
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copiamos solo los archivos necesarios
COPY package*.json ./

# Instalamos solo dependencias de producción (--omit=dev)
RUN npm install --omit=dev

# Copiamos la carpeta dist/ generada en el builder
COPY --from=builder /app/dist ./dist

# Puerto donde corre NestJS (según tu main.ts es 3000 por defecto)
EXPOSE 3000

# Comando para arrancar en producción
CMD ["npm", "run", "start:prod"]
