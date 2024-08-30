# Stage 1: Build the application
FROM node:21-alpine3.18 AS builder

WORKDIR /huntx-engine

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the application
RUN npx nx build

# Stage 2: Create the runtime image
FROM node:21-alpine3.18

# Set environment variables
ENV NODE_ENV=production

# Create and use a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /huntx-engine

# Copy the build artifacts from the builder stage
COPY --from=builder /huntx-engine/dist ./dist
COPY --from=builder /huntx-engine/package.json ./
COPY --from=builder /huntx-engine/node_modules ./node_modules

ENTRYPOINT [ "node", "--env-file=./.env", "./dist/huntx/main.js" ]

# Expose the application port
EXPOSE 8080
