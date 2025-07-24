# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only dependency files first for caching
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm install --production
RUN cd frontend && npm install --production

# Copy source
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Move build to correct location
RUN mkdir -p backend/public && \
    cp -r frontend/dist/* backend/public/ && \
    mv backend/public /app/public  # Fix path to match Express

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 8080

# Start backend
CMD ["npm", "start"]