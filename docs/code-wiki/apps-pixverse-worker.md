# apps/pixverse-worker (PixVerse Worker)

The PixVerse worker is a standalone Node service that provides a job-based HTTP API for long-running PixVerse CLI executions. It is designed to be called by the web app’s BFF routes, not directly from the browser.

Code root: [apps/pixverse-worker/src](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src)

Related docs:

- Product/run doc: [pixverse-worker.md](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/ai/pixverse-worker.md)
- ADR: [0002-pixverse-worker.md](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/architecture/ADR/0002-pixverse-worker.md)

## Entry Point and Responsibilities

- HTTP server + routing + orchestration: [server.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts)
- PixVerse CLI wrapper: [runPixverse.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/pixverse/runPixverse.ts)
- Template catalog: [templates.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/templates/templates.ts)
- Job persistence:
  - [jobs/store.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/jobs/store.ts)
  - [marketing/store.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/marketing/store.ts)

## Worker API

The worker uses a simple `node:http` server and implements routing in a switch statement.

Implementation: [server.ts routing](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L803-L978)

- `GET /health`
- `GET /templates`
- Template jobs:
  - `GET /jobs?status=<queued|running|succeeded|failed>`
  - `POST /jobs` with `{ templateId: string, variables: object }`
  - `GET /jobs/:jobId`
- Marketing jobs:
  - `GET /marketing/jobs?status=<queued|running|succeeded|failed>`
  - `POST /marketing/jobs` with a marketing brief payload (see types)
  - `GET /marketing/jobs/:jobId`
  - `GET /marketing/archive` (reads the generated manifest JSON)

## Job Model and Persistence

### Template jobs (video)

Types: [jobs/types.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/jobs/types.ts)

- A job references a `templateId` and a `variables` object.
- A job tracks status transitions and produces `output.clips[]` for multi-scene generation.

Persistence:

- Store class: [JobStore](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/jobs/store.ts#L30-L75)
- Default store path: `apps/pixverse-worker/data/jobs.json` (sample: [jobs.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/data/jobs.json))

### Marketing jobs (image + video assets)

Types: [marketing/types.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/marketing/types.ts)

- A marketing job is a “batch” run: multiple images and videos produced from a brief.
- Job outputs are recorded and also written into docs manifests for reuse by the web app.

Persistence:

- Store class: [MarketingJobStore](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/marketing/store.ts#L31-L97)
- Default store path: `apps/pixverse-worker/data/marketing-jobs.json` (sample: [marketing-jobs.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/data/marketing-jobs.json))

Docs manifests (written on each upsert):

- Writer: [recordMarketingJobInDocs](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/marketing/archive.ts#L55-L87)
- Archive: [marketing-assets.archive.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/ai/generated/marketing-assets.archive.json)
- Latest: [marketing-assets.latest.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/ai/generated/marketing-assets.latest.json)

## Execution Model (Queues + Concurrency)

The worker uses in-memory queues per lane and caps concurrent running jobs.

- Template jobs:
  - `enqueue()` + `drainQueue()`: [server.ts queue](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L504-L533)
  - Job executor: [runJob](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L374-L502)
- Marketing jobs:
  - `enqueueMarketingJob()` + `drainMarketingQueue()`: [server.ts marketing queue](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L762-L792)
  - Job executor: [runMarketingJob](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L535-L760)

Key normalization and safety limits:

- Template variable normalization: [normalizeVariables](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L71-L110)
- Prompt renderer: [renderPrompt](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L112-L134)
- Multi-scene selection: [getScenes](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L154-L172)
- Marketing brief normalization: [normalizeMarketingInput](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/server.ts#L189-L296)

## PixVerse CLI Integration

The worker runs PixVerse through a small wrapper around `child_process.spawn()`.

- `createVideoFromPrompt(...)`: [runPixverse.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/pixverse/runPixverse.ts#L115-L195)
  - Calls `pixverse create video --no-wait --json`
  - Extracts `video_id`, then calls `pixverse task wait <id> --timeout <sec> --json`
  - Extracts `video_url` and optional `cover_url`
- `createImageFromPrompt(...)`: [runPixverse.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/pixverse/runPixverse.ts#L197-L244)

The executable is configurable:

- `PIXVERSE_CLI_BIN` (default `npx`): [runPixverse.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker/src/pixverse/runPixverse.ts#L126-L127)

## Environment Variables

Documented set (with defaults): [pixverse-worker.md env section](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/ai/pixverse-worker.md#L61-L70)

- `PORT` (default `4107`)
- `PIXVERSE_CLI_BIN` (default `npx`)
- `PIXVERSE_WORKER_STORE_PATH` (default `./data/jobs.json`)
- `PIXVERSE_WORKER_MAX_CONCURRENCY` (default `1`)
- `PIXVERSE_WORKER_TIMEOUT_SEC` (default `900`)
- `PIXVERSE_MARKETING_STORE_PATH` (default `./data/marketing-jobs.json`)
- `PIXVERSE_MARKETING_ARCHIVE_PATH` (default `../../docs/ai/generated/marketing-assets.archive.json`)
- `PIXVERSE_MARKETING_LATEST_PATH` (default `../../docs/ai/generated/marketing-assets.latest.json`)
