# Running Locally

This repo contains two runnable services:

- `apps/web` (Next.js UI + BFF APIs)
- `apps/pixverse-worker` (PixVerse long-running job worker)

You can run the web app by itself (mock-first endpoints), but AI Studio and marketing generation require the worker.

## Prerequisites

- Node.js 20+ (worker doc requirement: [pixverse-worker.md](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/ai/pixverse-worker.md#L5-L10))
- Package manager:
  - `apps/web` includes a `pnpm-lock.yaml` and works well with `pnpm`
  - `apps/pixverse-worker` includes a `package-lock.json` and is set up for `npm ci` / `npm install`
- PixVerse CLI (only required if you will run PixVerse generation):
  - `npm install -g pixverse`
  - `pixverse auth login --json`

## Run the PixVerse Worker

From the repo root:

```bash
cd apps/pixverse-worker
npm install
npm run dev
```

Defaults:

- URL: `http://localhost:4107`
- Healthcheck: `GET http://localhost:4107/health`

Environment variables (optional): [apps-pixverse-worker.md](./apps-pixverse-worker.md#environment-variables)

## Run the Web App

From the repo root:

```bash
cd apps/web
pnpm install
pnpm dev
```

Defaults:

- URL: `http://localhost:3000`
- Healthcheck: `GET http://localhost:3000/api/health`

## Connect apps/web → pixverse-worker

Set this environment variable when launching `apps/web`:

```bash
PIXVERSE_WORKER_URL=http://localhost:4107
```

The web BFF proxy routes will call the worker:

- Templates: [ai-studio/templates route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/templates/route.ts)
- Jobs: [ai-studio/jobs route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/jobs/route.ts)

Example pages that rely on the worker:

- `http://localhost:3000/ai-studio/videos`
- `http://localhost:3000/ai-studio/marketing`

## Docker (web only)

Docker manifests are provided for `apps/web` under `infrastructure/`.

Steps: [infrastructure/README.md](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/infrastructure/README.md#L12-L43)

```bash
cd infrastructure
cp .env.example .env
docker compose up -d --build
```

Port mapping is controlled by:

- [docker-compose.yml](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/infrastructure/docker-compose.yml#L1-L10)
- [infrastructure/.env.example](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/infrastructure/.env.example)

Known issue (as committed):

- The Dockerfile uses `npm ci` and copies `apps/web/package-lock.json`, but `apps/web` currently ships `pnpm-lock.yaml` instead. See [Dockerfile](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/infrastructure/Dockerfile#L4-L8).
