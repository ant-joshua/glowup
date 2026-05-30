# Codebase Map

Glowup OS is a monorepo organized around one primary fullstack web app plus supporting workers and documentation.

## Top-Level Directories

- `.trae/`: Trae-native workflow artifacts (plans, specs, skills)
  - See: [.trae/README.md](../../.trae/README.md)
- `apps/`: runnable applications
- `docs/`: product, business, architecture, API, AI, and delivery docs
- `infrastructure/`: docker-based local deployment for `apps/web`
- `packages/`: reserved for shared packages (currently minimal)

## Applications

### `apps/web` (Next.js fullstack)

Purpose:
- Product UI plus “backend-for-frontend” APIs using Next.js route handlers.

Key folders:
- UI routes: `apps/web/src/app/**`
- API routes: `apps/web/src/app/api/**`
- UI primitives: `apps/web/src/components/ui/**` (shadcn + Radix)
- Feature modules: `apps/web/src/features/**`
- Shared utilities: `apps/web/src/lib/**` and `apps/web/src/app/_lib/**`

Notable patterns:
- Mock-first development via route handlers + deterministic JSON
  - Fetch helper: [mockApi.ts](../../apps/web/src/app/_lib/mockApi.ts#L13-L22)
- External worker bridging for PixVerse via server-side route handlers
  - Jobs proxy: [route.ts](../../apps/web/src/app/api/ai-studio/jobs/route.ts)
  - Templates proxy: [route.ts](../../apps/web/src/app/api/ai-studio/templates/route.ts)

### `apps/pixverse-worker` (Node worker)

Purpose:
- Self-hosted HTTP worker that runs PixVerse CLI locally and exposes a job-based API for the web app.

Key files/folders:
- HTTP server: [server.ts](../../apps/pixverse-worker/src/server.ts)
- PixVerse runner: `apps/pixverse-worker/src/pixverse/runPixverse.ts`
- Job persistence (JSON file stores): `apps/pixverse-worker/src/jobs/` and `apps/pixverse-worker/src/marketing/`
- Templates: `apps/pixverse-worker/src/templates/templates.ts`

Docs:
- [PixVerse Worker](../ai/pixverse-worker.md)

## Documentation

### Product and delivery
- PRDs: `docs/product/PRD-*.md`
- Backlog and sprints: `docs/tasks/**`

### Engineering
- System design: `docs/architecture/System-Design.md`
- Event architecture: `docs/architecture/Event-Architecture.md`
- ADRs: `docs/architecture/ADR/**`
- API contract: `docs/api/OpenAPI.yaml`

### AI (agents, workflows, evaluation)
- `docs/ai/Workflows/`: runbooks like [Plan + Spec Driven Development](../ai/Workflows/plan-spec-driven-development.md)
- `docs/ai/Prompts/`: reusable prompt templates

## Development Entry Points

- Web app: `apps/web` (`npm|pnpm` scripts in `apps/web/package.json`)
- PixVerse worker: `apps/pixverse-worker` (Node + TypeScript, scripts in `apps/pixverse-worker/package.json`)
- Docker local deploy: `infrastructure/README.md`
