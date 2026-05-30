# Gap Plan: Local PixVerse Generation (Friend Async)

## Summary
Enable a teammate to generate videos locally with PixVerse CLI (on their own machine), then contribute back to the project by committing **metadata only** (PixVerse-hosted URLs + fields) so the app can render videos without running PixVerse in production yet.

This is intentionally a “bridge” approach until we ship the self-hosted worker plan in [pixverse-cli-video-generation-plan.md](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/.trae/documents/pixverse-cli-video-generation-plan.md).

## Current State (Repo Truth)
- The app already renders AI Studio videos from a mock list in [videos route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/videos/route.ts) and UI in [videos page](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/ai-studio/videos/page.tsx).
- Video items already match a “metadata-only” shape: `title`, `platform`, `status`, `durationSec`, `createdAt`, and `assets.videoUrl` / `assets.thumbnailUrl`.

## Step 1 — Local generation setup (friend machine)

### A) Install PixVerse CLI + authenticate
Follow PixVerse CLI README:
- Install:
  - `npm install -g pixverse`
- Authenticate:
  - `pixverse auth login`

### B) Install PixVerse “skills” library (requested)
This repo is referenced for structured workflows and correct flag usage:
- https://github.com/PixVerseAI/skills

The most relevant documents to follow for repeatable generation are typically under:
- `skills/workflows/storyboard-to-video.md`
- `skills/capabilities/create-video.md`
- `skills/capabilities/task-management.md` (poll/wait patterns)

### C) Standardize local output: always request JSON
To make integration deterministic and avoid parsing free-form logs:
- Prefer PixVerse CLI `--json` output for all create operations.

Example “makeup tutorial” starting point (friend adapts flags to PixVerse docs):
- `pixverse create video --prompt "<makeup tutorial prompt>" --json`

## Step 2 — Metadata-only contribution flow (repo)

### A) Add a committed manifest file (single source of truth)
Create one canonical manifest in the repo that the app reads at runtime:
- `apps/web/src/app/api/ai-studio/videos/manifest.json`

Manifest schema (aligned with the current UI types):
- `items[]`:
  - `id`: string
  - `title`: string
  - `platform`: string (`TikTok`, `Instagram Reels`, `YouTube Shorts`, etc.)
  - `status`: string (`draft` | `rendering` | `published`)
  - `durationSec`: number
  - `createdAt`: ISO string
  - `assets`:
    - `thumbnailUrl`: string (PixVerse-hosted URL)
    - `videoUrl`: string | null (PixVerse-hosted URL; null if not ready)
  - `source` (optional): `{ provider: "pixverse", assetId?: string, rawJson?: object }`
  - `featured` (optional): boolean

### B) Update the existing AI Studio videos API to load from the manifest
Modify [videos route](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/ai-studio/videos/route.ts) to:
- import `manifest.json` (TS config already supports JSON via `resolveJsonModule`)
- filter by `status` query param (keep current behavior)
- return `items` from manifest instead of the hard-coded array

### C) Friend’s async workflow (repeatable)
For each new video:
1) Run PixVerse CLI locally with `--json`.
2) Copy out:
   - PixVerse-hosted `videoUrl`
   - PixVerse-hosted `thumbnailUrl`
   - optional `assetId` (for traceability)
3) Append an item into `manifest.json` (status `published` if ready).
4) Commit only the manifest change (no MP4s in git).

### D) Landing page embed (optional, still metadata-only)
Update [Home page](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/page.tsx) to:
- fetch `/api/ai-studio/videos`
- render:
  - either the first `featured: true` item, or
  - the latest `published` item
- embed as a link out to the hosted `videoUrl` (or embed `<video>`/`iframe` if PixVerse URLs support it)

## Verification (Gap Plan)
- `apps/web`:
  - `npm run lint` passes
  - `npm run build` passes
  - `/ai-studio/videos` shows items from `manifest.json`
  - optional: Home page shows the featured/latest published video

## Upgrade Path (to the Worker Plan)
Once the worker exists, we keep the same `VideoItem` metadata shape, but switch the source of truth from git-committed `manifest.json` to a worker-backed job store.

