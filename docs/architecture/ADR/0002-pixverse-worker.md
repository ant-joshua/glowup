# ADR 0002: PixVerse Worker for Long-Running Jobs

## Status

Accepted

## Context

We need to generate images/videos via PixVerse CLI. These calls can be long-running, may need polling, and should not block typical web request lifecycles. We also want deterministic job tracking and artifacts saved for later reuse.

## Decision

- PixVerse execution runs in a separate Node worker app: `apps/pixverse-worker`.
- `apps/web` talks to the worker through server-side route handlers (BFF proxy pattern).
- The worker exposes a job-based HTTP API:
  - `POST /jobs`, `GET /jobs/:jobId`, `GET /templates`
  - Marketing: `POST /marketing/jobs`, `GET /marketing/jobs/:jobId`, `GET /marketing/archive`
- The worker persists job state to JSON stores under `apps/pixverse-worker/data/`.

## Alternatives Considered

- Run PixVerse CLI directly inside `apps/web` route handlers — rejected because it couples long-running work to web request execution and makes scaling/limits harder.
- Use a hosted queue/service immediately — rejected for MVP simplicity; can be introduced later without changing the web UI contracts.

## Consequences

- Web stays responsive and can keep UI/API stable while compute runs elsewhere.
- Worker becomes the boundary for operational rules (timeouts, concurrency, no secret leakage).
- Deployment adds another service if we want PixVerse generation outside local dev.
