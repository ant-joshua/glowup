---
name: "glowup-plan-spec-generator"
description: "Plan+spec generator for Glowup OS. Produces .trae plan docs and .trae spec packages (spec/tasks/checklist), then guides implementation with repo conventions."
---

# Glowup Plan + Spec Generator

Use this skill to turn a feature request into a plan-driven and spec-driven work package aligned to this repository’s conventions.

## Invoke When

- The user asks to “make a plan”, “write a spec”, “do plan/spec driven development”, or “break this down into tasks + checklist”.
- The user wants a repeatable workflow for a change that spans multiple areas (web app, worker, docs, infra).

## Outputs

Depending on scope, produce one or more of:

- `/.trae/documents/<topic>-plan.md`
- `/.trae/specs/<spec-name>/spec.md`
- `/.trae/specs/<spec-name>/tasks.md`
- `/.trae/specs/<spec-name>/checklist.md`

## Hard Rules

- Always link to sources of truth
  - PRDs: `docs/product/PRD-*.md`
  - Architecture: `docs/architecture/**`
  - API contracts: `docs/api/OpenAPI.yaml`
  - Relevant code paths
- Always keep acceptance criteria objectively verifiable
  - Use lint/build/tests, endpoint responses, and UI routes as checklist items.
- Never introduce new dependencies without verifying they already exist in the repo
  - Check `apps/web/package.json` and/or `apps/pixverse-worker/package.json`.
- Never log or commit secrets
  - Do not print or store credentials, tokens, or PixVerse auth data.
- Prefer mock-first + deterministic contracts
  - Establish stable interfaces first (route handlers + JSON shapes), then swap implementations later.

## Process

### 1) Ask for missing context

Collect:
- Feature request + target user outcome
- Affected app(s): `apps/web`, `apps/pixverse-worker`, infra, docs
- References: PRD/architecture/API docs
- Acceptance signals: what “done” looks like

### 2) Write the plan (optional)

If the work has meaningful trade-offs or cross-cutting constraints:
- Create `/.trae/documents/<topic>-plan.md`
- Follow: `/.trae/documents/_template-plan.md`

### 3) Write the spec (recommended for non-trivial work)

- Create `/.trae/specs/<spec-name>/`
- Follow: `/.trae/specs/_template/`
- Include:
  - Requirements with SHALL statements
  - Scenario bullets (GIVEN/WHEN/THEN)
  - Task breakdown with dependencies
  - Checklist that can be executed as validation

### 4) Guide execution

After plan/spec are approved:
- Execute tasks in `tasks.md`
- Validate with the relevant app scripts:
  - `apps/web`: `npm run lint`, `npm run build`
  - `apps/pixverse-worker`: `npm run build`
- Update docs when behavior/contracts change

## Repo References

- Workflow overview: [.trae/README.md](../../README.md)
- Codebase map: [Codebase-Map.md](../../../docs/architecture/Codebase-Map.md)
- Example spec: [scaffold-prd-ui-mock-api](../../specs/scaffold-prd-ui-mock-api/spec.md)
