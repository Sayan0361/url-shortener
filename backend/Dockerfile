# Use Node 20 Alpine
FROM node:20-alpine

WORKDIR /app

# Copy package files and install deps
COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Build the app if needed
# RUN pnpm run build

# Expose backend port
EXPOSE 5000

# Environment variables will be injected by Render
ENV PORT=5000
ENV NODE_ENV=production

# Start the app
CMD ["pnpm", "start"]