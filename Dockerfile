# Stage 1: Build the application
FROM node:21-alpine3.18 AS builder

WORKDIR /job-nest

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

WORKDIR /job-nest

# Copy the build artifacts from the builder stage
COPY --from=builder /job-nest/dist ./dist
COPY --from=builder /job-nest/package.json ./
COPY --from=builder /job-nest/node_modules ./node_modules

ENTRYPOINT [ "node", "--env-file=./.env", "./dist/job-nest/main.js" ]

# Expose the application port
EXPOSE 8080
