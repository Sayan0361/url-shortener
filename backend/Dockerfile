# Use Node 20 Alpine
FROM node:20-alpine

WORKDIR /app

# Copy package files and install deps
COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --prod

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

# Start app
CMD ["pnpm", "start"]
