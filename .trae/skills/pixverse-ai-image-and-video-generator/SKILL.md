---
name: "pixverse-ai-image-and-video-generator"
description: "PixVerse CLI video/image generation via --json workflows. Invoke when user asks to generate/edit videos/images with PixVerse CLI, or build automation around pixverse commands."
---

# PixVerse CLI (Local)

Use PixVerse CLI to generate videos/images from the terminal with structured JSON output for reliable automation.

## Invoke When
- The user asks to generate AI videos/images using PixVerse (text-to-video, image-to-video, templates, modifications).
- The user asks to build an internal endpoint/worker/script that runs PixVerse CLI via `npx`/`pixverse`.
- The user needs polling, job tracking, or asset downloading for PixVerse generations.

## Hard Rules
- Always use `--json` for any automated flow.
- Treat stdout as machine-readable JSON and stderr as errors/diagnostics.
- Never log or commit PixVerse auth data (stored under `~/.pixverse/`).

## Install & Auth
```bash
npm install -g pixverse
pixverse --version
pixverse auth login --json
pixverse auth status --json
```

## Create Video (Text → Video)
```bash
pixverse create video --prompt "A natural office makeup tutorial, step-by-step, clean lighting, 9:16" --json
```

To submit without waiting (then poll later):
```bash
pixverse create video --prompt "A natural office makeup tutorial, step-by-step, clean lighting, 9:16" --no-wait --json
pixverse task wait <TASK_OR_VIDEO_ID> --json
```

## Template-Driven Creation
Browse and select an effect template, then create from it.
```bash
pixverse template list --json
pixverse template info <TEMPLATE_ID> --json
pixverse create template --template-id <TEMPLATE_ID> --json
```

## Asset Management (Download / Inspect)
```bash
pixverse asset info <ASSET_ID> --json
pixverse asset download <ASSET_ID> --json
```

## Exit Codes (Operational)
- `0`: success
- `3`: auth expired → re-run `pixverse auth login --json`
- `4`: insufficient credits → check `pixverse account info --json`
- `5`: generation failed → adjust prompt/params

## Example: “Makeup Tutorial” Pipeline (JSON-first)
Goal: create a short vertical video suitable for landing page embedding, returning a hosted URL in the JSON payload.

1) Ensure auth is valid:
```bash
pixverse auth status --json
```

2) Create:
```bash
pixverse create video --prompt "Makeup tutorial: natural office look. 4 steps: prep, base, eyes, lip. Educational tone. Vertical 9:16. Clean studio lighting." --json
```

3) If you used `--no-wait`, poll:
```bash
pixverse task wait <TASK_OR_VIDEO_ID> --json
```

4) Use the returned JSON to extract the hosted `video_url` (and optional `thumbnail_url`) for app metadata.

## Upstream Reference
- Docs & workflows: https://github.com/PixVerseAI/skills
- Master skill entry: https://raw.githubusercontent.com/PixVerseAI/skills/main/skills/SKILL.md

