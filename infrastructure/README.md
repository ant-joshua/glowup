# Infrastructure
 
Docker-based local deployment for the Next.js app in `apps/web`.

## Files

- `Dockerfile`: Builds and runs `apps/web` using a multi-stage Node image (deps → build → runtime).
- `docker-compose.yml`: Starts the `web` service using the Dockerfile from the repo root build context.
- `.env`: Runtime configuration loaded by Docker Compose (gitignored).
- `.env.example`: Template for `.env`.

## Quick Start

From the repository root:

```bash
cd infrastructure
cp .env.example .env
docker compose up -d --build
```

App will be available at:

- `http://localhost:${WEB_PORT}` (defaults to `http://localhost:3000`)

## Configuration

Docker Compose loads `infrastructure/.env`.

| Variable | Default | Description |
| --- | --- | --- |
| `WEB_PORT` | `3000` | Host port to expose the app on |
| `PORT` | `3000` | Container port used by `next start` |
| `NEXT_TELEMETRY_DISABLED` | `1` | Disables Next.js telemetry |

## Common Commands

```bash
cd infrastructure
docker compose up -d --build
docker compose logs -f web
docker compose down
```
