FROM node:alpine AS deps
WORKDIR /usr/src/app

RUN apk add --no-cache bash curl unzip && \
    curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

COPY package.json bun.lock ./

RUN bun install --production --frozen-lockfile

FROM node:alpine AS build
WORKDIR /usr/src/app

RUN apk add --no-cache bash curl unzip && \
    curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM node:alpine AS final
WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN apk add --no-cache sed

COPY --from=build /root/.bun/bin/bun /usr/local/bin/

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/server ./server
COPY --from=build /usr/src/app/package.json ./package.json

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh && chown -R node:node /usr/src/app

USER node

EXPOSE 3000

ENTRYPOINT ["entrypoint.sh"]
CMD ["bun", "run", "serve"]