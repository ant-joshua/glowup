# Plan: Install PixVerseAI “skills” into local Trae

## Summary
Add a local Trae skill so the agent can reliably operate PixVerse CLI using PixVerseAI’s official skill documentation (especially `--json` output, task polling, and template workflows).

Source: https://github.com/PixVerseAI/skills

## What “install” means in Trae
Trae skills are markdown-based skill packs stored under:
- Project-local: `.trae/skills/<skill-name>/SKILL.md`

Once present, the agent can load and follow the instructions consistently when you ask for PixVerse CLI video/image generation.

## Proposed Skill
Create a project skill:
- Path: `.trae/skills/pixverse-ai-image-and-video-generator/SKILL.md`

### Frontmatter
- `name`: `pixverse-ai-image-and-video-generator`
- `description` (≤ 200 chars, must include when to invoke):
  - “PixVerse CLI video/image generation via --json workflows. Invoke when user asks to generate/edit videos/images with PixVerse CLI, or build automation around pixverse commands.”

### Content (body)
Keep it focused on the parts we actually need in this repo:
- Installation and authentication:
  - `npm install -g pixverse`
  - `pixverse auth login --json`
  - `pixverse auth status --json`
- Core creation commands (always `--json`):
  - `pixverse create video ... --json`
  - `pixverse create template ... --json` (for template-driven creation)
- Task management:
  - `pixverse task status ... --json`
  - `pixverse task wait ... --json`
  - Handle exit code 3 (re-auth) and 4 (credits)
- Asset management:
  - `pixverse asset info ... --json`
  - `pixverse asset download ... --json`
- “Do / Don’t” guardrails:
  - Do not run without `--json` in automation paths
  - Never print tokens / secrets; never commit `~/.pixverse/`

## Two installation options

### Option A (Recommended): Vendor a curated subset into Trae
Pros: small, stable, tailored to our workflow.  
Cons: manual updates when PixVerse changes.

Steps:
1) Copy the relevant sections from:
   - `https://raw.githubusercontent.com/PixVerseAI/skills/main/skills/SKILL.md`
2) Paste + trim into `.trae/skills/pixverse-ai-image-and-video-generator/SKILL.md`
3) Add a short “template-driven makeup tutorial” example that matches our AI Studio flow (create → wait → surface hosted URL).

### Option B: Mirror upstream files into the repo
Pros: full upstream capability library and workflows.  
Cons: large + noisy diffs; not all of it will be used day-to-day.

Steps:
1) Add upstream `skills/` directory into `docs/vendor/pixverse-skills/`
2) Keep Trae SKILL.md short, but link to the local vendored docs for deep dives.

## Verification
- Confirm the new skill directory exists under `.trae/skills/`
- Confirm the skill name is unique and descriptive
- Confirm the skill body includes:
  - when to invoke
  - `--json` contract
  - auth + task wait + asset download patterns

## Follow-up (Optional)
Align this with the worker plan by standardizing on PixVerse CLI JSON fields (video/task ids, asset urls) so both “local gap” and “worker” implementations share the same parsing logic.

