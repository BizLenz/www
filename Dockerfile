# Base image with Corepack enabled
FROM node:lts-alpine AS base
RUN corepack enable

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
COPY sst-env.d.ts* ./
RUN pnpm install --frozen-lockfile

# Build the Next.js app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Create the production runner image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the standalone Next.js output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port 3000 for the ALB target
EXPOSE 3000

# Start the prebuilt server directly
CMD ["node", "server.js"]