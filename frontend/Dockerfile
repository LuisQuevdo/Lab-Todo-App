# Imagen base: nginx:alpine
FROM nginx:alpine

# Copiar archivos HTML/CSS/JS al directorio correcto de Nginx
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# El puerto 80 ya está expuesto por defecto en la imagen Nginx, pero se puede añadir
EXPOSE 80
