# Stage 1: Install dependencies
FROM node:20 AS dependencies

WORKDIR /app

# Copy package files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Stage 2: Build (optional)
FROM node:20 AS build

WORKDIR /app

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# If using TypeScript or build steps, run here; otherwise, comment out or remove
RUN npx tsc --noEmit || true

# Stage 3: Production image
FROM node:20-alpine

WORKDIR /app

# Copy node_modules and app source from build stage
COPY --from=build /app ./

# Expose port 8080 as expected by Azure
EXPOSE 8080

# Set the PORT environment variable (good practice)
ENV PORT=8080

# Start the backend application; ensure your package.json start script runs your backend server
CMD ["npm", "start"]

# Health check for container monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1
