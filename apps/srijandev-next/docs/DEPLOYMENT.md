# Enterprise Deployment Guide

## 1. Vercel Deployment

1. Connect repository `srijandev-next`.
2. Set Root Directory to `apps/srijandev-next`.
3. Framework Preset: Next.js.
4. Set Environment Variables (`DATABASE_URL`).
5. Deploy.

## 2. Docker Container Deployment

Use the following `Dockerfile` inside `apps/srijandev-next`:

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Run Docker build:

```bash
docker build -t srijandev-next:latest .
docker run -p 3000:3000 srijandev-next:latest
```
