# 1. Imagen base: node:18-alpine
FROM node:18-alpine

# 2. Working directory
WORKDIR /app

# 3. Copiar package files
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar código fuente
COPY . .

# 6. Exponer puerto 3000
EXPOSE 3000

# 7. Comando de inicio
CMD ["npm", "start"]
