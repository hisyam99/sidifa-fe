FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

FROM base AS install
COPY package.json bun.lock /tmp/
WORKDIR /tmp
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=install /tmp/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS final

ENV NODE_ENV=production

USER bun

WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/server ./server
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 3000

CMD ["bun", "run", "serve"]