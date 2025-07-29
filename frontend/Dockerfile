# Stage 1: Build the React app
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production image with Nginx
FROM nginx:alpine
RUN apk add --no-cache curl
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S habitarium -u 1001

# Expose port 80 (typical for Nginx)
EXPOSE 8080

# Health check on the exposed port
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
