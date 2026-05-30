# Spec Prompt Template

Use this when you want a spec folder under `/.trae/specs/` with requirements, tasks, and acceptance checklist.

## Prompt

Create a spec for the following work:

- Repo: Glowup OS (monorepo)
- Spec name (folder): <kebab-case-name>
- Work request: <describe the feature/change>
- Relevant sources:
  - PRD(s): <links under docs/product/>
  - Architecture docs: <links under docs/architecture/>
  - API docs: <OpenAPI path if relevant>
  - Code pointers: <paths>

Output:
- Create `/.trae/specs/<spec-name>/spec.md`
- Create `/.trae/specs/<spec-name>/tasks.md`
- Create `/.trae/specs/<spec-name>/checklist.md`
- Follow the structure in `/.trae/specs/_template/`
- Make `checklist.md` objectively verifiable (lint/build/test/endpoints/pages)
