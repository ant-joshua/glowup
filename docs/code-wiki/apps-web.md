# apps/web (Next.js Fullstack)

The web app is a Next.js App Router project that contains:

- UI routes (React Server Components + Client Components) under `src/app/**`
- Backend-for-frontend API routes under `src/app/api/**`
- Feature modules under `src/features/**`

Code root: [apps/web/src](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src)

## Folder Structure

- App Router
  - UI routes: [src/app](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app)
  - API routes: [src/app/api](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api)
  - Shared app-scoped utilities: [src/app/_lib](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_lib)
  - Shared app-scoped components: [src/app/_components](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_components)
- Reusable “feature” modules: [src/features](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features)
- Shared UI primitives (shadcn/Radix wrappers): [src/components/ui](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/components/ui)
- Cross-cutting shared utilities: [src/lib](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/lib)

## Key UI Routes

Entry + global layout:

- Global layout (CSS, metadata, fonts): [layout.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/layout.tsx)
- Landing page: [page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/page.tsx)

AI Studio:

- AI Studio index: [ai-studio/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/ai-studio/page.tsx)
- Video playground: [ai-studio/videos/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/ai-studio/videos/page.tsx)
- Marketing playground: [ai-studio/marketing/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/ai-studio/marketing/page.tsx)

“Hub” routes (PRD scaffolding):

- Core: [core/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/core/page.tsx)
- Creator: [creator/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/creator/page.tsx)
- Commerce: [commerce/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/commerce/page.tsx)
- Clinic: [clinic/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/clinic/page.tsx)
- Intelligence: [intelligence/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/intelligence/page.tsx)

## API Routes (BFF)

API routes live under `src/app/api/**/route.ts` and are used for:

- Deterministic mock responses (mock-first BFF pattern)
- Proxy endpoints to the PixVerse worker

Design decision: [ADR 0003](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/docs/architecture/ADR/0003-mock-first-bff.md)

### Worker Proxy Endpoints

Template jobs (video):

- List/create jobs: [ai-studio/jobs route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/jobs/route.ts)
  - Key functions:
    - `getWorkerBaseUrl()` (env + default normalization)
    - `validateCreateBody(body)` (server-side input limits)
    - `POST()` validates template existence by calling worker `/templates`
- Fetch job: [ai-studio/jobs/[jobId] route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/jobs/%5BjobId%5D/route.ts)
- Templates: [ai-studio/templates route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/templates/route.ts)

Marketing jobs:

- List/create marketing jobs: [ai-studio/marketing/jobs route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/marketing/jobs/route.ts)
- Fetch marketing job: [ai-studio/marketing/jobs/[jobId] route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/marketing/jobs/%5BjobId%5D/route.ts)

Reusable marketing “product endpoints” (outside AI Studio namespace):

- List/create: [marketing-assets/jobs route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/marketing-assets/jobs/route.ts)
- Archive: [marketing-assets/archive route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/marketing-assets/archive/route.ts)
- Prompt library (reads docs JSON): [marketing-assets/prompt-library route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/marketing-assets/prompt-library/route.ts)

### Example Mock Endpoints

- Web healthcheck: [health route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/health/route.ts)
- Core profile: [core/profile route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/core/profile/route.ts)
- Intelligence coach: [intelligence/coach route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/intelligence/coach/route.ts)

## Feature Modules

Feature modules are reusable UI + state + client API logic used by multiple pages.

### AI Video

Path: [src/features/ai-video](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features/ai-video)

- UI: [AiVideoPlayground.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features/ai-video/AiVideoPlayground.tsx)
- Orchestration hook: [useAiVideoPlayground.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features/ai-video/useAiVideoPlayground.ts)
- Client API wrapper (calls BFF routes): [api.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features/ai-video/api.ts)
- State store (Zustand): [store.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features/ai-video/store.ts)

Notable responsibilities (high level):

- `api.ts` defines the network contract between UI and the web BFF routes (`/api/ai-studio/*`).
- `useAiVideoPlayground` owns “load templates → submit job → poll until done” control flow.
- The Zustand store normalizes template fields into a shape suitable for forms and job submission.

### Marketing Assets

Path: [src/features/marketing-assets](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features/marketing-assets)

- “Studio” UI: [LandingMarketingStudio.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features/marketing-assets/LandingMarketingStudio.tsx)
- Generator hook: [useMarketingAssetGenerator.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features/marketing-assets/useMarketingAssetGenerator.ts)
- Client API wrapper: [api.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features/marketing-assets/api.ts)
- Landing content library: [landingAssets.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/features/marketing-assets/landingAssets.ts)

Notable responsibilities (high level):

- The hook coordinates submission + polling of marketing jobs and can also load archive + prompt library.
- The API wrapper maps feature calls to the reusable BFF endpoints under `/api/marketing-assets/*`.

## Shared Components and Utilities

### App shell

- Sidebar wrapper: [app-sidebar.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/components/app-sidebar.tsx)
- Sidebar: [sidebar.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/components/sidebar.tsx)

### Page scaffolding

- Page container: [PageShell.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_components/PageShell.tsx)
- Link-card grid: [LinkCards.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_components/LinkCards.tsx)
- Breadcrumb: [SectionCrumb.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_components/SectionCrumb.tsx)

### Request origin and mock fetch

These helpers allow server components / route handlers to call internal APIs using the correct origin (local dev vs deployed).

- `getRequestOrigin()`: [requestOrigin.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_lib/requestOrigin.ts)
- `fetchMockJson<T>()`: [mockApi.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_lib/mockApi.ts#L1-L23)

### Tailwind class merge helper

- `cn(...)`: [utils.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/lib/utils.ts)
