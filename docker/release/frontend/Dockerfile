FROM node:22-alpine AS builder

WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY frontend/ ./
ARG APP_VERSION=0.0.0-dev
ENV VITE_APP_VERSION=${APP_VERSION} \
    VITE_API_BASE_URL=/api
RUN npm run build

FROM nginx:1.27-alpine AS runtime

ENV NGINX_PORT=80 \
    API_UPSTREAM=http://backend:8000

COPY docker/release/frontend/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
