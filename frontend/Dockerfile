# Stage 1: Build React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first to cache dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the app (CRA outputs to /build by default)
RUN npm run build

# Stage 2: Production image with Nginx
FROM nginx:alpine

# Install curl for healthchecks
RUN apk add --no-cache curl

# Copy built app from builder stage (CRA default build dir is /build)
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config (optional, remove if not needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S habitarium -u 1001

# Expose port 80 (typical for Nginx)
EXPOSE 80

# Health check on the exposed port
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
