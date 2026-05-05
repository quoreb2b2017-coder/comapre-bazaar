FROM node:20-bookworm-slim

WORKDIR /app/backend

# Install backend dependencies first (better layer caching).
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source only.
COPY backend/ ./

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
