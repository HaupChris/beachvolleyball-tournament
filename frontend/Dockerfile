# Verwende ein Node.js-Image als Basis
FROM node:18-alpine

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die package.json und package-lock.json Dateien in den Container
COPY ../frontend/package.json package-lock.json ./

# Installiere die Node-Abhängigkeiten
RUN npm install

# Kopiere den Rest des Codes in das Arbeitsverzeichnis
COPY ../frontend .

# Baue die React-App für die Produktion
RUN npm run build

# Verwende ein einfaches Webserver-Image, um die statischen Dateien zu bedienen
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Exponiere den Port 80
EXPOSE 80

# Starte den NGINX-Server
CMD ["nginx", "-g", "daemon off;"]
