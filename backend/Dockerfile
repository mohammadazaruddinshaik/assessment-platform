FROM node:22.12-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma.config.ts ./
COPY prisma ./prisma

RUN DATABASE_URL=postgresql://localhost:5432/docker-build npx prisma generate

COPY src ./src

FROM node:22.12-bookworm-slim AS production

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY src ./src
COPY --chmod=755 docker-entrypoint.sh ./docker-entrypoint.sh

EXPOSE 5000

USER node

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]
