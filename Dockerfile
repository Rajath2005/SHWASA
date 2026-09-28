FROM node:22-alpine

RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --fetch-timeout=600000 --fetch-retries=5
COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]