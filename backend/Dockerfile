FROM node:20-alpine

WORKDIR /app

# Copy dependency files first (for better caching)
COPY package*.json pnpm-lock.yaml* ./

RUN npm install -g pnpm
RUN pnpm install --prod

# Copy only the source (after deps installed)
COPY . .

EXPOSE 5000
ENV PORT=5000 NODE_ENV=production

CMD ["pnpm", "start"]
