# ADR 0001: Next.js Fullstack

## Status

Accepted

## Context

We need a fullstack setup where the frontend and backend can be shipped together with minimal operational overhead.

## Decision

- The primary app is `apps/web`, implemented with Next.js.
- Backend endpoints are implemented via Next.js API route handlers under `apps/web/src/app/api/**`.
- No standalone API service is required for the MVP.

## Consequences

- Deployment is simpler (single app).
- API and UI share types and utilities.
- Long-running jobs and heavy compute may need separate workers/services later.

