FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openjdk17-jre

COPY package.json package-lock.json api.yaml ./

RUN npm ci

RUN npm run generate

COPY . .

RUN cd src && npm install --omit=dev --ignore-scripts

RUN npm prune --omit=dev

FROM gcr.io/distroless/nodejs24-debian12:nonroot

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /app /app

USER nonroot

EXPOSE 3000

CMD ["src/index.js"]