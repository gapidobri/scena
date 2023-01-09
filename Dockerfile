FROM node:16-alpine AS base

RUN npm i -g pnpm

FROM base AS build

# Fetch dependencies
COPY pnpm-lock.yaml ./
RUN pnpm fetch

# Copy all files
ADD . .

# Install dependencies from local store
RUN pnpm install --offline

# Generate prisma client
RUN pnpx prisma generate

# Set default environment variables
ENV S3_ENDPOINT=""
ENV S3_REGION=""
ENV S3_BUCKET=""
ENV S3_ACCESS_KEY_ID=""
ENV S3_SECRET_ACCESS_KEY=""
ENV S3_EXPIRATION_TIME=""
ENV KRATOS_PUBLIC_URL=""
ENV KRATOS_PRIVATE_URL=""
ENV CDN_PUBLIC_URL=""
ENV DATABASE_URL=""

# Build app
RUN pnpm build

# Remove development dependencies
RUN pnpm prune --production

FROM base as app

WORKDIR /app

COPY --from=build ./package.json ./package.json
COPY --from=build ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build ./node_modules ./node_modules
COPY --from=build ./build .

CMD [ "node", "index.js" ]