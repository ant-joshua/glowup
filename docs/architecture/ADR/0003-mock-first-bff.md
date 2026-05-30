# ADR 0003: Mock-First BFF APIs in Next.js Route Handlers

## Status

Accepted

## Context

We want to iterate on UI quickly before backend services are fully defined. At the same time, we want stable API contracts that can later be implemented with real data sources without changing the UI.

## Decision

- Implement backend-for-frontend endpoints using Next.js route handlers under `apps/web/src/app/api/**`.
- Start with deterministic mock JSON responses for each PRD area and feature module.
- UI consumes these endpoints first, so pages render with no external dependencies (no DB required for early UI validation).

## Alternatives Considered

- Build a standalone API service first — rejected for MVP speed; adds deployment and contract overhead too early.
- Hardcode mock data directly in UI components — rejected; it prevents contract reuse and makes later backend integration noisier.

## Consequences

- UI and API evolve together and can share types and utilities.
- API routes become the contract boundary; later we can swap mock implementations for real ones behind the same routes.
- We need to keep mock endpoints and UI expectations in sync (spec/checklist discipline helps).
