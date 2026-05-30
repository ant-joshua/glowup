## `.trae/` (Trae Workspace)

This folder stores Trae-native artifacts that make our development workflow repeatable:

- Plans (high-level intent, constraints, approach)
- Specs (requirements + tasks + acceptance checklist)
- Skills (reusable sub-agents/runbooks)

### Structure

- `documents/`
  - Plan-driven documents, typically named `*-plan.md`
  - Example: [pixverse-cli-video-generation-plan.md](documents/pixverse-cli-video-generation-plan.md)
- `specs/`
  - Spec-driven work packages, one folder per spec:
    - `spec.md`: requirements and scenarios
    - `tasks.md`: decomposed implementation tasks (with dependencies when useful)
    - `checklist.md`: acceptance checklist (what “done” means)
  - Example: [scaffold-prd-ui-mock-api](specs/scaffold-prd-ui-mock-api/spec.md)
- `skills/`
  - Reusable “sub-agent packs” that capture operational runbooks and hard rules
  - Example: [pixverse-ai-image-and-video-generator](skills/pixverse-ai-image-and-video-generator/SKILL.md)

### Workflow (Plan → Spec → Execute)

1) Plan
- Create a plan under `documents/` when the work is non-trivial, multi-step, or has important constraints/trade-offs.
- Output: a single markdown file that answers “why/what/how/risks”.

2) Spec
- Create a spec folder under `specs/<spec-name>/` when we want explicit requirements, scenarios, and acceptance criteria.
- Output: `spec.md`, `tasks.md`, `checklist.md`.

3) Execute
- Implement tasks in code, validating with lint/build/tests.
- Keep `tasks.md` and `checklist.md` aligned to reality (update them when scope changes).

### Conventions

- Specs are small by default
  - Prefer “thin vertical slices” over giant specs.
  - Each spec should be possible to validate via its checklist.
- Link to sources
  - Specs and plans should link to PRDs under `docs/product/`, architecture docs under `docs/architecture/`, and relevant code paths.
- Prefer deterministic mock data early
  - Prototype UI against stable mock endpoints first, then swap implementations behind the same contract.

### Templates

- Spec template: `specs/_template/`
- Plan template: `documents/_template-plan.md`
