# ---------- STAGE 1: Build frontend ----------
FROM node:18 AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build


# ---------- STAGE 2: Build backend ----------
FROM node:18 AS backend-build

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build


# ---------- STAGE 3: Production ----------
FROM node:18

# Install nginx
RUN apt-get update && apt-get install -y nginx

WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend ./backend

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# 👉 IMPORTANT: matches your code
ENV PORT=8000

EXPOSE 10000

# Start both
CMD sh -c "node backend/dist/server.js & nginx -g 'daemon off;'"