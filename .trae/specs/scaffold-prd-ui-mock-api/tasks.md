# Tasks
- [x] Task 1: Confirm PRD page map from docs/product/PRD-001..006 and define minimal UI routes per PRD area (landing + 3-5 subpages).
- [x] Task 2: Create shared app navigation and layout structure for the six PRD areas.
- [x] Task 3: Add mock API route handlers for PRD-001 Core (profile, analysis summary, roadmap, progress).
- [ ] Task 4: Build PRD-001 UI pages that consume PRD-001 mock APIs.
- [x] Task 5: Add mock API route handlers for PRD-002 Creator (creator profile, routines, feed).
- [ ] Task 6: Build PRD-002 UI pages that consume PRD-002 mock APIs.
- [x] Task 7: Add mock API route handlers for PRD-003 Commerce (catalog, product detail, shopping list, affiliate analytics).
- [ ] Task 8: Build PRD-003 UI pages that consume PRD-003 mock APIs.
- [x] Task 9: Add mock API route handlers for PRD-004 AI Studio (script, storyboard, videos list).
- [ ] Task 10: Build PRD-004 UI pages that consume PRD-004 mock APIs.
- [x] Task 11: Add mock API route handlers for PRD-005 Intelligence (goals, persona, recommendations, coach).
- [ ] Task 12: Build PRD-005 UI pages that consume PRD-005 mock APIs.
- [x] Task 13: Add mock API route handlers for PRD-006 Clinic (search results, profile detail, booking slots).
- [ ] Task 14: Build PRD-006 UI pages that consume PRD-006 mock APIs.
- [ ] Task 15: Add basic validation: lint + build must pass; add minimal smoke checks for key routes and mock endpoints.

# Task Dependencies
- Task 2 depends on Task 1
- Tasks 4, 6, 8, 10, 12, 14 depend on Task 2 and their corresponding mock API task
- Tasks 3/5/7/9/11/13 can run in parallel after Task 2
- Tasks 4/6/8/10/12/14 can run in parallel after their mock APIs exist
- Task 15 depends on Tasks 3-14
