# Glowup OS Code Wiki

This wiki documents the code-level architecture of the Glowup OS monorepo: how the major modules fit together, what the key entrypoints are, and how to run the system locally.

## Contents

- [Architecture](./architecture.md)
- [apps/web (Next.js fullstack)](./apps-web.md)
- [apps/pixverse-worker (PixVerse worker)](./apps-pixverse-worker.md)
- [Running Locally](./running.md)

## Quick Orientation

- Main UI + BFF API: [apps/web](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web)
- PixVerse long-running jobs: [apps/pixverse-worker](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/pixverse-worker)
- Docker local deployment (web only): [infrastructure](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/infrastructure)
- Architecture + ADRs: [docs/architecture](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/architecture)
- API contract (high level): [OpenAPI.yaml](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/api/OpenAPI.yaml)

## Primary Architectural Decisions (ADRs)

- Next.js fullstack approach: [0001-nextjs-fullstack.md](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/architecture/ADR/0001-nextjs-fullstack.md)
- PixVerse worker for long-running jobs: [0002-pixverse-worker.md](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/architecture/ADR/0002-pixverse-worker.md)
- Mock-first BFF APIs: [0003-mock-first-bff.md](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/architecture/ADR/0003-mock-first-bff.md)
- Package management: [0004-package-management.md](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/architecture/ADR/0004-package-management.md)
