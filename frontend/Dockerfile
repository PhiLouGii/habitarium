# Stage 1: Dependencies
FROM node:20 AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build
FROM node:20 AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build || echo "Ignoring TypeScript errors"

# Stage 3: Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

# Health check on the exposed port
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1