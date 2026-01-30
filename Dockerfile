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

# Kopiujemy konfigurację Nginxa z reverse proxy do backendu
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiujemy zbudowane pliki z poprzedniego etapu (z folderu build lub dist)
# Sprawdź czy Twój React buduje do /app/build czy /app/dist (zwykle build)
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]