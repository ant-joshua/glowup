# Architecture

Glowup OS is a monorepo organized around a single fullstack Next.js application plus a supporting worker for PixVerse “long-running” AI generation jobs.

## Repository Topology

- `apps/web`: Next.js App Router app containing:
  - UI routes under `src/app/**`
  - BFF API routes under `src/app/api/**`
- `apps/pixverse-worker`: Node HTTP worker that:
  - Runs PixVerse CLI via `child_process.spawn()`
  - Persists job state to JSON files
  - Exposes a job-based HTTP API consumed by `apps/web`
- `docs`: Product, architecture, API, and AI documentation (also includes generated artifacts in `docs/ai/generated/`)
- `infrastructure`: Docker-based local deployment manifests for `apps/web`

## Key Architectural Patterns

### 1) Next.js as UI + Backend-for-Frontend (BFF)

The web app serves both the UI and a set of server-side route handlers that act as the product-facing API layer.

- API route location: [apps/web/src/app/api](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api)
- Design decision: [ADR 0003](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/architecture/ADR/0003-mock-first-bff.md)

Two kinds of BFF endpoints exist:

- Mock-first product endpoints that return deterministic JSON (intended to be swapped to real implementations later).
- Proxy endpoints that forward requests to the PixVerse worker.

### 2) Worker boundary for long-running AI jobs (PixVerse)

PixVerse CLI calls can take long and require polling. Those calls run in a separate worker service.

- Design decision: [ADR 0002](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/architecture/ADR/0002-pixverse-worker.md)
- Worker entrypoint: [server.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts)
- PixVerse integration: [runPixverse.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/pixverse/runPixverse.ts)

## System Boundaries and Data Flow

### End-to-end: Video generation (templates → jobs)

1. UI (client) calls web BFF endpoints.
2. Web BFF proxies to worker.
3. Worker runs PixVerse CLI and persists job state.
4. UI polls job status until completion.

Primary call chain:

- UI feature module API client: [features/ai-video/api.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features/ai-video/api.ts)
- Web BFF proxy:
  - [ai-studio/templates route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/templates/route.ts)
  - [ai-studio/jobs route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/jobs/route.ts)
- Worker endpoints:
  - [server.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L803-L978) (routing)
  - [runJob](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L374-L502)
- PixVerse CLI wrapper: [createVideoFromPrompt](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/pixverse/runPixverse.ts#L115-L195)

### End-to-end: Marketing asset generation (brief → images/videos → manifests)

Marketing jobs are a second “lane” in the worker. They generate multiple image/video assets, and then write “latest” and “archive” manifests into the repo docs folder for reuse by the web app.

- Web BFF proxies:
  - [ai-studio/marketing/jobs route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/marketing/jobs/route.ts)
  - [marketing-assets archive route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/marketing-assets/archive/route.ts)
- Worker marketing executor: [runMarketingJob](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L535-L760)
- Manifest writer: [recordMarketingJobInDocs](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/marketing/archive.ts#L55-L87)
- Prompt library served by web (reads from docs): [prompt-library route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/marketing-assets/prompt-library/route.ts)

## Dependency Relationships

### Runtime service dependencies

- `apps/web` depends on:
  - Itself (UI + BFF) at `http://localhost:3000` in dev
  - Optional `apps/pixverse-worker` at `PIXVERSE_WORKER_URL` for AI Studio and marketing generation flows
- `apps/pixverse-worker` depends on:
  - PixVerse CLI available in runtime environment (via `npx pixverse ...` by default)
  - PixVerse account authentication and credits (for actual media generation)

### Data/artifact dependencies (within the repo)

- Worker writes job stores:
  - [apps/pixverse-worker/data/jobs.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/data/jobs.json)
  - [apps/pixverse-worker/data/marketing-jobs.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/data/marketing-jobs.json)
- Worker writes marketing manifests under docs:
  - [docs/ai/generated/marketing-assets.archive.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/ai/generated/marketing-assets.archive.json)
  - [docs/ai/generated/marketing-assets.latest.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/ai/generated/marketing-assets.latest.json)
- Web reads prompt library JSON:
  - [docs/ai/generated/marketing-prompt-library.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/ai/generated/marketing-prompt-library.json)

## Codebase Map References

Existing high-level map: [Codebase-Map.md](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/architecture/Codebase-Map.md)
