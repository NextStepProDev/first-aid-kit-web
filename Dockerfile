# --- ETAP 1: Budowanie aplikacji (Build Stage) ---
FROM node:20-alpine AS build

WORKDIR /app

# Deklarujemy ARG, aby Docker przyjął zmienną z docker-compose.yml
# To jest kluczowe, żeby pozbyć się tego upartego portu 8082
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Kopiujemy pliki zależności
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę kodu źródłowego
COPY . .

# Budujemy aplikację - w tym momencie REACT_APP_API_URL zostaje "wszyty" w kod JS
RUN npm run build

# --- ETAP 2: Serwowanie aplikacji (Production Stage) ---
FROM nginx:stable-alpine

# Usuwamy domyślną konfigurację Nginxa
RUN rm /etc/nginx/conf.d/default.conf

# Tworzymy nową konfigurację, która wspiera React Router (Single Page Application)
RUN echo 'server { \
    listen 80; \
    \
    # Security headers \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-Frame-Options "DENY" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    add_header Referrer-Policy "strict-origin-when-cross-origin" always; \
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always; \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \
        root /usr/share/nginx/html; \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
        add_header X-Content-Type-Options "nosniff" always; \
    } \
    \
    # Obsługa błędów 404/500 \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Kopiujemy zbudowane pliki z poprzedniego etapu (z folderu build lub dist)
# Sprawdź czy Twój React buduje do /app/build czy /app/dist (zwykle build)
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]