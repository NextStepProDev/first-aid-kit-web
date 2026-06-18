# --- ETAP 1: Budowanie aplikacji (Build Stage) ---
FROM node:22-alpine AS build

WORKDIR /app

# Deklarujemy ARG, aby Docker przyjął zmienną z docker-compose.yml
# To jest kluczowe, żeby pozbyć się tego upartego portu 8082
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Kopiujemy pliki zależności
COPY package*.json ./

# Instalujemy zależności z lockfile (reprodukowalnie; react-scripts usunięty,
# więc --legacy-peer-deps nie jest już potrzebny)
RUN npm ci

# Kopiujemy resztę kodu źródłowego
COPY . .

# Budujemy aplikację - w tym momencie VITE_API_URL zostaje "wszyty" w kod JS
RUN npm run build

# --- ETAP 2: Serwowanie aplikacji (Production Stage) ---
FROM nginx:stable-alpine

# Kopiujemy konfigurację Nginxa z reverse proxy do backendu
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiujemy zbudowane pliki z poprzedniego etapu (Vite buduje do /app/dist)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]