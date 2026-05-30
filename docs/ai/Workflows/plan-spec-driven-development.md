# Plan + Spec Driven Development (Glowup OS)

This repo uses a plan-driven and spec-driven workflow to keep product intent, engineering decisions, and implementation tasks tightly aligned.

## Where Artifacts Live

- Plans: `.trae/documents/*-plan.md`
- Specs: `.trae/specs/<spec-name>/{spec.md,tasks.md,checklist.md}`
- Skills (sub-agents/runbooks): `.trae/skills/<skill-name>/SKILL.md`

See the overview in [.trae/README.md](../../../.trae/README.md).

## When to Use Which

### Write a plan when
- The work has multiple valid approaches with meaningful trade-offs.
- The work depends on constraints (security, infra, API contracts, performance).
- The work impacts multiple areas (web app + worker + docs + infra).

### Write a spec when
- You want requirements, scenarios, and acceptance criteria captured explicitly.
- You want a decomposed task list that is easy to execute and validate.
- You want a crisp definition of “done” via a checklist.

## Standard Flow

### 1) Start from a source of truth
- Product: `docs/product/PRD-*.md`
- Architecture: `docs/architecture/*`
- API contracts: `docs/api/OpenAPI.yaml`

### 2) Produce a plan (if needed)
- Create `./.trae/documents/<topic>-plan.md`
- Prefer a compact plan that answers: why, goals, approach, constraints, risks, validation.
- Use the template: [.trae/documents/_template-plan.md](../../../.trae/documents/_template-plan.md)

Examples:
- [pixverse-cli-video-generation-plan.md](../../../.trae/documents/pixverse-cli-video-generation-plan.md)

### 3) Produce a spec
- Create `./.trae/specs/<spec-name>/`
- Include:
  - `spec.md`: requirements, scenarios, constraints
  - `tasks.md`: implementation steps with dependencies
  - `checklist.md`: acceptance criteria
- Use the template: [.trae/specs/_template](../../../.trae/specs/_template/spec.md)

Examples:
- [scaffold-prd-ui-mock-api](../../../.trae/specs/scaffold-prd-ui-mock-api/spec.md)

### 4) Execute the tasks
- Implement tasks in the codebase.
- Validate via lint/build/tests for the affected app(s).
- Keep the spec current:
  - Update `tasks.md` if tasks merge/split.
  - Update `checklist.md` if acceptance criteria changes.

### 5) Capture reusable knowledge
- If the work includes repeatable operational knowledge (CLI recipes, polling behavior, output formats), capture it as a skill under `.trae/skills/`.
- If the work includes a stable workflow/runbook, capture it under `docs/ai/Workflows/`.

## “Skills” as Sub-Agents

In this repo, a Trae “skill” is treated as a reusable sub-agent pack:

- It defines when to invoke it (“Invoke When”)
- It encodes hard rules (security, output format, correctness constraints)
- It provides runbooks and command recipes that are easy to reuse

Example:
- [pixverse-ai-image-and-video-generator](../../../.trae/skills/pixverse-ai-image-and-video-generator/SKILL.md)
