# PRD 001-006 UI + Mock API Spec

## Why
We need a working UI foundation aligned to PRD-001 through PRD-006 so product validation can start immediately, while backend services are still undefined.

## What Changes
- Add a PRD-aligned page map in `apps/web` for PRD-001..PRD-006
- Add mock API endpoints (Next.js route handlers) that return deterministic sample data for each PRD area
- Update UI pages to consume mock APIs first (no database dependency)
- **BREAKING**: None

## Impact
- Affected specs: UI routing, API contracts, mock data strategy
- Affected code: `apps/web/src/app/**`, `apps/web/src/app/api/**`
- Source PRDs:
  - `docs/product/PRD-001-Core.md`
  - `docs/product/PRD-002-Creator.md`
  - `docs/product/PRD-003-Commerce.md`
  - `docs/product/PRD-004-AI.md`
  - `docs/product/PRD-005-Personal-Intellegence-System.md`
  - `docs/product/PRD-006-Clinic.md`

## ADDED Requirements
### Requirement: PRD Navigation
The system SHALL provide top-level navigation to the six PRD areas.

#### Scenario: User switches PRD area
- **WHEN** the user selects a PRD area from the app navigation
- **THEN** the user is routed to that PRD area landing page

### Requirement: Beautiful UI Baseline
The system SHALL implement a cohesive, high-quality visual design system across all PRD pages.

#### Design Direction (Baseline)
- Editorial, information-dense layouts with generous whitespace and strong typographic hierarchy
- Calm, ink-on-paper neutrals with high-contrast accents (area-specific) used sparingly for meaning and interaction
- Subtle depth (hairline borders, soft shadows, gentle gradients) without “card soup”
- Motion used for clarity (state changes, focus/hover, page transitions), not decoration

#### Design System Rules (Implementation Constraints)
- Use design tokens (CSS variables and Tailwind utilities) for colors, radii, shadows, and spacing
- Replace default system fonts with a deliberate font pair:
  - Display: Fraunces
  - Body: Spline Sans
  - Mono: Azeret Mono
- Avoid hard-coded hex colors in component markup; use tokens/utilities derived from tokens instead
- Provide dark mode parity (no “incomplete” dark theme screens)

#### Recommended Tokens
- Neutrals
  - `--bg`: `#fbfaf7`
  - `--surface`: `#ffffff`
  - `--ink`: `#121212`
  - `--muted`: `#5b5b5b`
  - `--border`: `#e7e4dc`
- PRD area accents
  - Core: `#b8ff4a`
  - Creator: `#ff3fb4`
  - Commerce: `#ffb020`
  - AI Studio: `#00d7ff`
  - Intelligence: `#8e62ff`
  - Clinic: `#ff5b3a`

#### Scenario: Page renders with consistent hierarchy
- **WHEN** any PRD page renders
- **THEN** it uses consistent heading levels, spacing scale, and section composition (header → content blocks)
- **AND** primary actions are visually prioritized over secondary actions
- **AND** dense information (tables, lists, metrics) remains scannable (alignment, grouping, labels)

#### Scenario: Area identity is visible but restrained
- **WHEN** the user navigates into a PRD area
- **THEN** the page header and navigation reflect the PRD area via a single accent color and label
- **AND** the accent is used for interactive affordances (active nav, primary button, focus ring), not for long-form text

#### Scenario: Accessibility and interaction quality
- **WHEN** the user navigates by keyboard
- **THEN** all interactive elements have a clearly visible focus state
- **AND** text contrast meets WCAG AA
- **AND** motion respects `prefers-reduced-motion`

#### Scenario: Responsive layout quality
- **WHEN** the viewport is below tablet width
- **THEN** navigation remains usable (wrap, horizontal scroll, or collapse)
- **AND** layouts reflow without clipped content or horizontal scrolling
  - **EXCEPT** intentional horizontal scrolling components (e.g., small tables) MAY scroll within their own container

### Requirement: Mock API (First)
The system SHALL expose mock API endpoints via Next.js route handlers that provide sample JSON responses for UI development.

#### Scenario: UI loads sample data
- **WHEN** a PRD page loads
- **THEN** it fetches its required data from the corresponding mock API endpoint
- **AND** the page renders without any external services (no DB, no auth provider required)

### Requirement: PRD Area Page Map
The system SHALL provide initial minimal pages per PRD area, scoped for UI scaffolding.

#### Next.js Route Map (UI)
| Area | Landing | Subpages |
| --- | --- | --- |
| App | `/` |  |
| PRD-001 Core | `/core` | `/core/profile`, `/core/analysis`, `/core/roadmap`, `/core/progress` |
| PRD-002 Creator | `/creator` | `/creator/profile`, `/creator/routines`, `/creator/routines/new`, `/creator/feed` |
| PRD-003 Commerce | `/commerce` | `/commerce/catalog`, `/commerce/products/[productId]`, `/commerce/shopping-list`, `/commerce/affiliate-analytics` |
| PRD-004 AI Studio | `/ai-studio` | `/ai-studio/script`, `/ai-studio/storyboard`, `/ai-studio/videos` |
| PRD-005 Intelligence | `/intelligence` | `/intelligence/goals`, `/intelligence/persona`, `/intelligence/recommendations`, `/intelligence/coach` |
| PRD-006 Clinic | `/clinic` | `/clinic/search`, `/clinic/experts/[expertId]`, `/clinic/booking` |

#### Scenario: PRD-001 Core entry
- **WHEN** the user navigates to the PRD-001 landing page
- **THEN** the app shows a minimal dashboard shell and links to: profile, analysis, roadmap, progress

#### Scenario: PRD-002 Creator entry
- **WHEN** the user navigates to the PRD-002 landing page
- **THEN** the app shows links to: creator profile, routine list, routine editor, feed

#### Scenario: PRD-003 Commerce entry
- **WHEN** the user navigates to the PRD-003 landing page
- **THEN** the app shows links to: product catalog, product detail, shopping list, creator affiliate analytics (mock)

#### Scenario: PRD-004 AI Studio entry
- **WHEN** the user navigates to the PRD-004 landing page
- **THEN** the app shows links to: script generator, storyboard generator, generated videos list (mock)

#### Scenario: PRD-005 Intelligence entry
- **WHEN** the user navigates to the PRD-005 landing page
- **THEN** the app shows links to: goal selection, persona selection, recommendations, coach (mock)

#### Scenario: PRD-006 Clinic entry
- **WHEN** the user navigates to the PRD-006 landing page
- **THEN** the app shows links to: expert/clinic search, profile detail, booking flow (mock)

## MODIFIED Requirements
### Requirement: API implementation approach
Backend endpoints SHALL be implemented using Next.js route handlers under the Next.js App Router (`src/app/api/**`).

## REMOVED Requirements
### Requirement: Standalone API service
**Reason**: MVP UI work will start with Next.js API routes and mock data.
**Migration**: If/when a dedicated API app is introduced, route handlers can be converted to proxy calls or moved into `apps/api`.
