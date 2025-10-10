FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# ===== BACKEND SETUP =====
WORKDIR /app/backend

# Copy backend package files
COPY backend/package.json ./
COPY backend/pnpm-lock.yaml ./

# Install backend dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy backend source code
COPY backend/ ./

# ===== FRONTEND SETUP =====
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package.json ./
COPY frontend/package-lock.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# ===== FINAL SETUP =====
WORKDIR /app/backend

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001
USER nodeuser

EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:10000/health || exit 1

# Start the backend (which will serve the frontend)
CMD ["node", "index.js"]