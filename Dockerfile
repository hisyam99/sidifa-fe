# ----------------------------
# Base image: Bun official
# ----------------------------
FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

# ----------------------------
# Install deps (cached)
# ----------------------------
FROM base AS install
# Cache dev deps
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Cache prod deps (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# ----------------------------
# Build stage (uses dev deps)
# ----------------------------
FROM base AS build
# Reuse dev node_modules for build
COPY --from=install /temp/dev/node_modules node_modules
# Copy project sources
COPY . .
# Qwik build (produces /dist dan /server)
ENV NODE_ENV=production
RUN bun run build

# ----------------------------
# Final runtime image (lean)
# ----------------------------
FROM oven/bun:1 AS final
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/server ./server
COPY --from=build /usr/src/app/package.json ./package.json

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh && chown -R bun:bun /usr/src/app

USER bun

EXPOSE 3000/tcp

ENTRYPOINT ["entrypoint.sh"]
CMD ["bun", "run", "serve"]
