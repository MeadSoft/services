FROM node:24-slim AS base

ENV APP_ENV="local"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
COPY . /workspace
WORKDIR /workspace

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpx nx run restaurant-catalog-api:build
RUN pnpm deploy --filter=restaurant-catalog-api --prod /app

FROM base
COPY --from=build /app /app
WORKDIR /app

EXPOSE 3000
CMD [ "node", "/app/dist/main.js" ]
