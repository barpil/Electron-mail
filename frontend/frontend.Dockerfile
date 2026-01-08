ARG NODE_VERSION=24.7.0-alpine
ARG NGINX_VERSION=alpine3.22

FROM node:${NODE_VERSION} AS builder
WORKDIR /frontend
COPY package* ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

USER root

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/ssl /etc/nginx/ssl
COPY --chown=nginx:nginx --from=builder /frontend/dist/*/browser /usr/share/nginx/html
COPY scripts/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 8433

USER nginx
ENTRYPOINT ["/entrypoint.sh"]
