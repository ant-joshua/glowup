# System Design

## Overview

Glowup OS is currently implemented as:

- A primary Next.js fullstack app (`apps/web`) providing UI + BFF APIs (Next.js route handlers)
- A supporting Node worker (`apps/pixverse-worker`) for long-running PixVerse CLI jobs
- A documentation and workflow layer (`docs/` + `.trae/`) that drives plan/spec execution and captures decisions (ADRs)

## Components

### Web (apps/web)

- UI routes: `apps/web/src/app/**`
- BFF APIs: `apps/web/src/app/api/**`
- External integration boundary: route handlers proxy to internal workers/services

### PixVerse Worker (apps/pixverse-worker)

- HTTP worker that runs PixVerse CLI and tracks jobs
- Templates provide structured inputs and deterministic prompt rendering
- Persists job state and artifacts to JSON stores under `apps/pixverse-worker/data/`

### Documentation and Artifacts

- Product docs: `docs/product/PRD-*.md`
- Architecture decisions: `docs/architecture/ADR/`
- Plan/spec workflow artifacts: `.trae/`
- Generated AI manifests (marketing): `docs/ai/generated/*.json`

## Data Flow

### Mock-first UI development

1) User navigates to a PRD page in `apps/web`.
2) The page calls a corresponding Next.js route handler under `/api/**`.
3) The route handler returns deterministic JSON (mock), enabling UI iteration without external dependencies.

### PixVerse generation (worker-backed)

1) User interacts with an AI Studio UI page in `apps/web`.
2) `apps/web` calls a server-side route handler (BFF endpoint).
3) The route handler proxies requests to `apps/pixverse-worker`.
4) The worker enqueues a job and runs PixVerse CLI.
5) The UI polls job status through the same BFF route until completion.
6) For marketing generation, the worker writes output manifests into `docs/ai/generated/`.

## Deployment

### Local development

- Run `apps/web` as the primary UI/API server.
- Run `apps/pixverse-worker` when working on PixVerse generation workflows.

### Docker (web)

`infrastructure/` provides a Docker-based local deployment for `apps/web`.

## Observability

### Health checks

- `apps/web`: `GET /api/health`
- `apps/pixverse-worker`: `GET /health`

### Logging and debugging

- `apps/pixverse-worker` stores job history including stderr and exit codes for failed jobs.
- For higher environments, add structured logging and persistence that replaces JSON file stores.
