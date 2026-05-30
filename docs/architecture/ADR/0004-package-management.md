# ADR 0004: Package Management and Workspace

## Status

Accepted

## Context

This repo is a monorepo with multiple apps. We want reproducible installs and a single workspace view for dependencies.

## Decision

- Use `pnpm` workspaces at the repo root (`pnpm-workspace.yaml`).
- App dependencies are managed per app:
  - `apps/web` (Next.js)
  - `apps/pixverse-worker` (Node worker)
- Prefer `pnpm` for consistent installs across the monorepo.

## Alternatives Considered

- Multiple isolated npm projects — rejected; increases duplication and makes cross-app changes harder.
- Yarn workspaces — not chosen; `pnpm` fits well with workspace + disk efficiency for monorepos.

## Consequences

- Developers should install with `pnpm` from repo root for best results.
- Each app can still be run independently, but shared workflows (lint/build) are easier to standardize later.
