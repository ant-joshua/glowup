# PixVerse CLI Video Generation (2-Step Plan)

## Summary
Add template-driven video generation powered by PixVerse CLI (no PixVerse API usage) by introducing a self-hosted worker that runs `npx` jobs, while the Next.js app proxies requests and renders videos (including optional landing-page embeds).

## Current State Analysis (Repo Truth)
- Next.js fullstack app exists at [apps/web](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web) (Next.js 16 App Router).
- AI Studio is currently a UI scaffold:
  - UI pages: [ai-studio](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/ai-studio/page.tsx), [videos page](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/ai-studio/videos/page.tsx)
  - Mock APIs: [script route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/script/route.ts), [storyboard route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/storyboard/route.ts), [videos route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/videos/route.ts)
- There is no PixVerse integration or `pixverse` dependency in [apps/web/package.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/package.json).
- Route handler typing in this Next.js version expects `context.params` as a `Promise` (see generated validator [validator.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/.next/types/validator.ts#L39-L47)), so dynamic API routes must follow that signature.

## Decisions (From Intent Chat)
- Runtime: PixVerse execution runs in a **self-hosted worker** (not serverless).
- Storage/Serving: videos are **PixVerse-hosted URLs**; we store metadata + status, not raw MP4 files.
- Interface: **template-driven** video generation for “makeup tutorial” (and similar) flows.

## Step 1 — MVP: Worker + Jobs + UI integration

### 1) Add PixVerse worker app (self-hosted)
**Goal:** a small HTTP service that:
1) accepts a “generate video from template” request,
2) runs PixVerse CLI via `child_process.spawn`,
3) captures the PixVerse-hosted URL from CLI output,
4) exposes job status + resulting URLs.

**Files to add (new app):**
- `apps/pixverse-worker/`
  - `package.json` (minimal scripts: `dev`, `build`, `start`)
  - `tsconfig.json`
  - `src/server.ts` (HTTP server)
  - `src/jobs/store.ts` (durable JSON store on disk with atomic writes)
  - `src/jobs/types.ts` (Job + Template param types)
  - `src/pixverse/runPixverse.ts` (spawn wrapper + output parsing)
  - `src/templates/` (template JSON files; e.g. `makeup-tutorial-v1.json`)

**Worker HTTP API (v1):**
- `GET /health` → `{ ok: true }`
- `GET /templates` → list of available templates (id, title, fields)
- `POST /jobs` → create a generation job
  - body example:
    - `templateId`: `"makeup-tutorial-v1"`
    - `variables`: `{ "topic": "Office makeup natural look", "steps": ["prep", "base", "eyes", "lip"], "tone": "educational" }`
- `GET /jobs/:jobId` → job detail (status + output URLs)
- `GET /jobs` → list jobs (filter by status)

**Job model (Step 1):**
- status: `queued | running | succeeded | failed`
- timestamps: `createdAt`, `startedAt`, `finishedAt`
- output:
  - `videoUrl` (PixVerse-hosted)
  - `thumbnailUrl` (PixVerse-hosted or derived)
  - `rawCliLogPath` (optional; local debug)

**Worker storage (Step 1):**
- JSON file store on worker disk (configurable path), written atomically:
  - write to `jobs.json.tmp` then rename → `jobs.json`

**PixVerse CLI runner (Step 1):**
- Use a fully controlled argument list (no shell string), e.g.:
  - `spawn("npx", ["pixverse", "create", "video", "--prompt", "...", "--json", ...])`
- Configuration via env:
  - `PIXVERSE_CLI_BIN` default: `npx`
  - `PIXVERSE_CLI_ARGS` default: `pixverse,create,video,--json,...`
- Output parsing:
  - Prefer `--json` output and parse stdout as JSON to extract `videoUrl` / `thumbnailUrl` deterministically
  - Fall back to regex extraction only if PixVerse CLI cannot output JSON for the chosen workflow
- Template rendering:
  - read template JSON, merge in `variables`, write a job-specific temp template file
  - only allow template files from `src/templates/` (whitelist by id)

### 2) Next.js “API proxy” routes to the worker
**Goal:** browser only talks to Next.js; Next.js talks to worker via `PIXVERSE_WORKER_URL`.

**Files to add/modify (apps/web):**
- Add `apps/web/src/app/api/ai-studio/templates/route.ts`
  - proxies `GET /templates` from worker
- Add `apps/web/src/app/api/ai-studio/jobs/route.ts`
  - `GET` list jobs (proxy)
  - `POST` create job (proxy; validate body shape + size)
- Add `apps/web/src/app/api/ai-studio/jobs/[jobId]/route.ts`
  - `GET` job detail (proxy)
  - must use Next’s dynamic route signature with `params: Promise<{ jobId: string }>`
- Keep existing [videos route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/videos/route.ts) for backward compat, but update AI Studio UI to prefer the new jobs-backed model.

**Validation & safety (proxy):**
- enforce maximum payload size (basic guard: limit `variables` fields + string lengths)
- templateId must be a known id (validate by calling `/templates` or cache in-memory per request)

### 3) UI: create video job + show status + embed hosted video
**Goal:** AI Studio Videos page becomes a usable “generate and track” screen.

**Files to modify/add (apps/web):**
- Update [AI Studio Videos page](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/ai-studio/videos/page.tsx)
  - Fetch job list from `/api/ai-studio/jobs`
  - Show statuses and the `videoUrl` link when ready
  - Add a client component to submit jobs
- Add `apps/web/src/app/ai-studio/videos/GenerateVideoClient.tsx`
  - Fetch templates from `/api/ai-studio/templates`
  - Render a template-driven form (based on template fields metadata)
  - Submit to `/api/ai-studio/jobs` and then poll `/api/ai-studio/jobs/:id`
- Optional: embed the latest succeeded video on the main landing page:
  - Update [Home page](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/page.tsx) to display a “Featured video” block using the most recent `succeeded` job.

### 4) Docs (how to run locally + self-host)
**Files to add (docs):**
- `docs/ai/pixverse-worker.md`
  - required env vars
  - how to start worker
  - how to point `apps/web` to the worker (`PIXVERSE_WORKER_URL`)
  - operational notes (where job store lives, log retention)

### Verification (Step 1)
- Worker:
  - `GET /health` returns ok
  - create a job using a template and confirm state transitions: queued → running → succeeded/failed
  - confirm URL extraction works (stdout parsing)
- Web:
  - `apps/web` build + lint passes
  - `/ai-studio/videos` can create a job and later renders the hosted URL

## Step 2 — Production hardening + “landing page video” + scale

### A) Reliable background execution (queue + concurrency)
- Add a real queue/execution model to worker:
  - max concurrency (e.g., 1–2 PixVerse runs at a time)
  - retry policy for transient failures
  - job cancellation (best-effort)
- Improve logs:
  - store structured execution logs per job
  - add log truncation / retention policy

### B) Durable metadata store
- Replace JSON store with a durable store:
  - SQLite on worker disk for simple self-host, or
  - Postgres (if/when backend exists) for multi-instance worker
- Add indexes for listing by status/time/templateId

### C) Template library + governance
- Add template versioning: `makeup-tutorial@v1`, `makeup-tutorial@v2`
- Add a minimal “template schema” validator (reject missing required fields)
- Add template preview endpoint that renders the exact PixVerse template payload (no CLI run)

### D) Better UI: publish-ready workflow
- Expand AI Studio flow to chain:
  - script → storyboard → template variables → generate video
- Add a “publish state” separate from “generation state”:
  - `draft/published/archived` with tags (platform, topic)
- Landing page integration:
  - allow selecting a featured video (not just latest)
  - provide fallback UI if no featured video exists

### E) Security/abuse controls
- Add auth for job submission (even simple shared secret between web and worker)
- Rate limit job creation per user/session (basic protection)
- Strict allowlist of CLI flags; never accept raw CLI args from client

## Assumptions
- PixVerse CLI can be invoked non-interactively in the worker environment.
- PixVerse CLI can output structured JSON (`--json`) that includes the hosted video URL, so the worker can parse output without brittle scraping.
- Worker has persistent disk (or external DB in Step 2).

## Open Inputs (Needed Before Execution)
- The exact PixVerse CLI command + flags for “template-driven” generation, and what stdout looks like when it returns the hosted URL (so we can lock `PIXVERSE_CLI_ARGS` + `PIXVERSE_OUTPUT_URL_REGEX`).
