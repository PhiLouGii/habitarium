FROM node:20-alpine

WORKDIR /app

# Install backend dependencies (production only)
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Install frontend dependencies (full install for build step)
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy source code
COPY backend ./backend
COPY frontend ./frontend

# Build frontend assets
RUN cd frontend && npm run build

# Copy frontend build to backend's public folder
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# Set working directory to backend before start
WORKDIR /app/backend

# Expose port
EXPOSE 8080

CMD ["npm", "start"]
