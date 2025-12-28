ARG NODE_VERSION=24.7.0-alpine
ARG NGINX_VERSION=alpine3.22

FROM node:${NODE_VERSION} AS builder
WORKDIR /frontend
COPY package* ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

USER nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=builder /frontend/dist/*/browser /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
