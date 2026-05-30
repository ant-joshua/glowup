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
- `GET /marketing/archive`
- `GET /marketing/jobs?status=<queued|running|succeeded|failed>`
- `POST /marketing/jobs`
  - body:
    - `campaignName`: string
    - `productName`: string
    - `audience`: string
    - `pageGoal`: string
    - `valueProp`: string
    - `cta`: string
    - `visualStyle`: string
    - `brandNotes`: string
    - `imageModel`: string
    - `imageQuality`: string
    - `imageAspectRatio`: string
    - `videoModel`: string
    - `videoQuality`: string
    - `videoAspectRatio`: string
    - `videoDurationSec`: number
    - `imageShots`: string[]
    - `videoBeats`: string[]
- `GET /marketing/jobs/:jobId`

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
- `PIXVERSE_MARKETING_STORE_PATH` (default `./data/marketing-jobs.json`)
- `PIXVERSE_MARKETING_ARCHIVE_PATH` (default `../../docs/ai/generated/marketing-assets.archive.json`)
- `PIXVERSE_MARKETING_LATEST_PATH` (default `../../docs/ai/generated/marketing-assets.latest.json`)

## Menghubungkan apps/web ke worker
Set env var di `apps/web`:
- `PIXVERSE_WORKER_URL=http://localhost:4107`

Lalu buka:
- `http://localhost:3000/ai-studio/videos`
- `http://localhost:3000/ai-studio/marketing`

Halaman ini akan:
- Load templates dari `/api/ai-studio/templates`
- Submit job ke `/api/ai-studio/jobs`
- Poll status job lewat `/api/ai-studio/jobs/:jobId`

Marketing playground akan:
- Submit brief ke `/api/ai-studio/marketing/jobs`
- Menjalankan `pixverse create image --json` dan `pixverse create video --json`
- Poll status job lewat `/api/ai-studio/marketing/jobs/:jobId`
- Menulis hasil manifest JSON ke `docs/ai/generated/marketing-assets.archive.json`
- Menulis hasil terakhir ke `docs/ai/generated/marketing-assets.latest.json`
