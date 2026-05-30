# Plan Prompt Template

Use this when you want an explicit plan document under `/.trae/documents/`.

## Prompt

Create a plan for the following work:

- Repo: Glowup OS (monorepo)
- Work request: <describe the feature/change>
- Relevant sources:
  - PRD(s): <links under docs/product/>
  - Architecture docs: <links under docs/architecture/>
  - Code pointers: <paths>

Output:
- Create `/.trae/documents/<topic>-plan.md`
- Follow the structure in `/.trae/documents/_template-plan.md`
- Include: approach, constraints, risks, and validation steps
- Keep it implementation-aware (call out affected apps/packages and key files)
