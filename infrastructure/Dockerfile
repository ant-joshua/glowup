FROM node:20-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
WORKDIR /app/apps/web
COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm ci

FROM deps AS prod-deps
RUN npm prune --omit=dev

FROM base AS builder
WORKDIR /app/apps/web
COPY apps/web/ ./
COPY --from=deps /app/apps/web/node_modules ./node_modules
RUN npm run build

FROM base AS runner
WORKDIR /app/apps/web
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/apps/web/next.config.ts ./next.config.ts
COPY --from=prod-deps /app/apps/web/node_modules ./node_modules
EXPOSE 3000
CMD ["sh", "-c", "npm run start -- -H 0.0.0.0 -p ${PORT}"]
