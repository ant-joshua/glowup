# PixVerse Worker

Self-hosted worker untuk menjalankan PixVerse CLI (via `npx`) dan mengembalikan URL hasil (PixVerse-hosted).

## Prasyarat
- Node.js >= 20
- PixVerse CLI:
  - `npm install -g pixverse`
  - `pixverse auth login --json`
- Akses PixVerse subscription/credits

## Menjalankan worker
```bash
cd apps/pixverse-worker
npm install
npm run dev
```

Default port: `4107`

Healthcheck:
- `GET http://localhost:4107/health`

## Worker API (v1)
- `GET /templates`
- `GET /jobs?status=<queued|running|succeeded|failed>`
- `POST /jobs`
  - body:
    - `templateId`: string
    - `variables`: object (sesuai field template)
- `GET /jobs/:jobId`

## Multi-scene (30 detik)
- Worker akan membuat 1 clip per item `steps` (scene).
- Set `sceneDurationSec` ke `5`–`10` detik.
- Total durasi target = `jumlah steps × sceneDurationSec` (misal 5 steps × 6 detik ≈ 30 detik).
- Output job akan berisi `output.clips[]` dengan URL per clip.

## Environment variables (worker)
- `PORT` (default `4107`)
- `PIXVERSE_CLI_BIN` (default `npx`)
- `PIXVERSE_WORKER_STORE_PATH` (default `./data/jobs.json`)
- `PIXVERSE_WORKER_MAX_CONCURRENCY` (default `1`)
- `PIXVERSE_WORKER_TIMEOUT_SEC` (default `900`)

## Menghubungkan apps/web ke worker
Set env var di `apps/web`:
- `PIXVERSE_WORKER_URL=http://localhost:4107`

Lalu buka:
- `http://localhost:3000/ai-studio/videos`

Halaman ini akan:
- Load templates dari `/api/ai-studio/templates`
- Submit job ke `/api/ai-studio/jobs`
- Poll status job lewat `/api/ai-studio/jobs/:jobId`
