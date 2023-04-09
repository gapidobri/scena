FROM node:16-alpine AS build

RUN npm i -g pnpm

# Fetch dependencies
COPY pnpm-lock.yaml ./
RUN pnpm fetch

# Copy all files
ADD . .

# Install dependencies from local store
RUN pnpm install --offline

# Generate prisma client
RUN sed -i '5,7d' prisma/schema.prisma
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
ENV KRATOS_ADMIN_URL=""
ENV CDN_PUBLIC_URL=""
ENV DATABASE_URL=""
ENV API_KEY=""

# Build app
RUN pnpm build

# Remove development dependencies
RUN pnpm prune --production

FROM node:16-alpine as app

WORKDIR /app

RUN npm i -g prisma

COPY --from=build ./package.json ./package.json
COPY --from=build ./node_modules ./node_modules
COPY --from=build ./build .
COPY --from=build ./prisma ./prisma

CMD [ "node", "index.js" ]
