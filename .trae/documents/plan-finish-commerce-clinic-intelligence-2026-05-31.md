# Plan: Finish Intelligence → Commerce → Clinic (UI + API Mocks)

## Summary

Implement “finished” versions of the remaining modules—**Intelligence**, **Commerce**, and **Clinic**—using the same approach as Core/Creator:

- Keep Next.js App Router + BFF route handlers (`apps/web/src/app/api/**`).
- Add **JSON-backed persistent mock stores** under `apps/web/data/*.json` with atomic writes.
- Upgrade pages to “real” interactions via `"use client"` components that call the BFF, then `router.refresh()` for server revalidation.
- Standardize UI to the existing design system (shadcn/radix-nova), replacing raw HTML controls where appropriate.

User decisions captured:

- **Order**: Intelligence → Commerce → Clinic
- **Commerce** scope: Wishlist + tracking
- **Clinic** scope: Booking flow (select slot → confirm booking → booking history)
- **Intelligence** scope: Selections + coach (persist goal/persona selection + coach thread)

## Current State Analysis (Grounded)

### Shared architecture patterns already in repo

- Persistent stores:
  - Core: [coreStore.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_lib/coreStore.ts) → [core-store.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/data/core-store.json)
  - Creator: [creatorStore.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_lib/creatorStore.ts) → [creator-store.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/data/creator-store.json)
  - Intelligence (already created but not wired to routes yet): [intelligenceStore.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_lib/intelligenceStore.ts) → [intelligence-store.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/data/intelligence-store.json)
- Server-page → client-component pattern:
  - Example: Core Profile [page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/core/profile/page.tsx) + [ProfileClient.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/core/profile/ProfileClient.tsx)
- Internal server-side fetching helpers:
  - [fetchMockJson](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_lib/mockApi.ts#L1-L23)
  - [getRequestOrigin](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_lib/requestOrigin.ts)

### UI system configuration

- shadcn config: [components.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/components.json)
  - `style`: `radix-nova`
  - `rsc`: `true`
  - alias `ui`: `@/components/ui`

### Module baselines

#### Intelligence (current)

- Pages are mostly read-only:
  - Goals: [goals/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/intelligence/goals/page.tsx)
  - Persona: [persona/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/intelligence/persona/page.tsx)
  - Recommendations: [recommendations/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/intelligence/recommendations/page.tsx)
  - Coach: [CoachClient.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/intelligence/coach/CoachClient.tsx) sends messages but is stateless server-side.
- APIs are mock and mostly GET-only:
  - Goals: [goals/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/intelligence/goals/route.ts)
  - Persona: [persona/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/intelligence/persona/route.ts)
  - Recommendations: [recommendations/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/intelligence/recommendations/route.ts)
  - Coach: [coach/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/intelligence/coach/route.ts)

#### Commerce (current)

- Read-only server pages with raw form controls:
  - Catalog: [catalog/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/commerce/catalog/page.tsx)
  - Product: [products/[productId]/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/commerce/products/%5BproductId%5D/page.tsx)
  - Shopping list: [shopping-list/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/commerce/shopping-list/page.tsx)
  - Affiliate analytics: [affiliate-analytics/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/commerce/affiliate-analytics/page.tsx)
- APIs are GET-only and backed by static data:
  - Data: [api/commerce/_data.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/commerce/_data.ts)
  - Routes: [api/commerce/**](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/commerce)

#### Clinic (current)

- Booking is read-only “slot list”; no POST booking:
  - Booking: [booking/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/clinic/booking/page.tsx)
- APIs:
  - Search: [search/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/clinic/search/route.ts)
  - Expert profile: [experts/[expertId]/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/clinic/experts/%5BexpertId%5D/route.ts)
  - Slots: [booking/slots/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/clinic/booking/slots/route.ts)

## Assumptions & Decisions (Locked)

- **No auth**: keep a single mock user (consistent with existing mocks): `usr_0001`.
- **Persistence**: filesystem JSON stores (atomic write + rename) in `apps/web/data`.
- **UI**: must match existing shadcn/radix-nova look; migrate raw `<input>/<select>/<button>` to UI primitives.
- **Not in scope**:
  - Commerce: cart/checkout/orders/payment; reviews CRUD.
  - Intelligence: recommendation save/dismiss/apply actions; integration into Core roadmap.
  - Clinic: clinic detail pages, payment, telehealth.

## Proposed Changes (Implementation Plan)

### Phase A — Intelligence (Selections + Coach)

#### A1) Use existing persistent store

- Already present (do not re-create, just wire it in):
  - [intelligenceStore.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/_lib/intelligenceStore.ts)
  - [intelligence-store.json](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/data/intelligence-store.json)
- Store shape (decision-complete):
  - `selectedGoalId: string`
  - `selectedPersonaId: string`
  - `coach: { threadId: string, messages: Array<{id, role, content, createdAt}> }`
  - `updatedAt: string`
- Existing helpers to use from the store module:
  - `normalizeId(...)` for goal/persona ids
  - `normalizeCoachContent(...)` for incoming coach messages
  - `appendCoachMessages(...)` and `resetCoachThread(...)` for thread updates
- ID reconciliation rule (to avoid broken persisted state):
  - When returning `selectedGoalId` / `selectedPersonaId` from API, if the stored id is not found in the current static list, fall back to the first available id and persist the corrected selection back into the store.

#### A2) Upgrade Intelligence APIs to read/write store

- Update existing route handlers to source selection + coach thread from store and add mutations:
  - Goals route: [goals/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/intelligence/goals/route.ts)
    - `GET /api/intelligence/goals`: return the static goals list plus `selectedGoalId` from store (with reconciliation rule).
      - Response: `{ ok, goals, recommendedGoalIds, selectedGoalId, generatedAt, updatedAt }`
    - `PUT /api/intelligence/goals`
    - Body: `{ selectedGoalId: string }`
    - Validates selected id exists in `goals[]`
      - Response: `{ ok, selectedGoalId, updatedAt }`
  - Persona route: [persona/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/intelligence/persona/route.ts)
    - `GET /api/intelligence/persona`: return static personas plus `selectedPersonaId` from store (with reconciliation rule).
      - Response: `{ ok, personas, selectedPersonaId, generatedAt, updatedAt }`
    - `PUT /api/intelligence/persona`
    - Body: `{ selectedPersonaId: string }`
    - Validates id exists in `personas[]`
      - Response: `{ ok, selectedPersonaId, updatedAt }`
  - Coach route: [coach/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/intelligence/coach/route.ts)
    - `GET /api/intelligence/coach`: return persisted thread from store.
      - Response: `{ ok, thread: { threadId, messages }, updatedAt, generatedAt }`
    - `POST /api/intelligence/coach`: append user message + generated reply into store using `appendCoachMessages`, then return updated thread.
      - Body: `{ message: string }`
      - Response: `{ ok, thread: { threadId, messages }, output: { message }, updatedAt }`
  - Add reset endpoint:
    - `POST /api/intelligence/coach/reset` at `apps/web/src/app/api/intelligence/coach/reset/route.ts`
      - Response: `{ ok, thread: { threadId, messages }, updatedAt }`

#### A3) Upgrade Intelligence UI to interactive, design-system compliant components

- Goals:
  - Introduce `apps/web/src/app/intelligence/goals/GoalsClient.tsx` (“use client”) that:
    - Renders goals as clickable cards
    - Calls `PUT /api/intelligence/goals`
    - Uses `Button`, `Card`, `Badge`; then `router.refresh()`
  - Update [goals/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/intelligence/goals/page.tsx) to render `GoalsClient`.
- Persona:
  - Similar: `PersonaClient.tsx` + update [persona/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/intelligence/persona/page.tsx).
- Coach:
  - Refactor [CoachClient.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/intelligence/coach/CoachClient.tsx) to:
    - Use `Textarea` + `Button` + `Card` styling
    - Handle server errors consistently (`{ ok:false, error }`)
    - Support “reset thread” (calls `/api/intelligence/coach/reset`) if implemented

### Phase B — Commerce (Wishlist + Tracking)

#### B1) Add persistent store

- Add:
  - `apps/web/src/app/_lib/commerceStore.ts`
  - `apps/web/data/commerce-store.json`
- Store shape:
  - `shoppingList`: `{ id, title, status, currency, items: Array<{id, productId, quantity, addedAt}> }`
  - `affiliateEvents`: Array<{ id, productId, kind: "click", createdAt }>
  - `updatedAt`
- Utilities:
  - `computeShoppingListTotals(...)`
  - `groupAffiliateEvents(period)` to power analytics.

#### B2) Shopping list CRUD APIs

- Keep existing GET response shape but source from store.
- Add mutation endpoints mirroring Core/Creator patterns:
  - Update existing `GET /api/commerce/shopping-list` in [shopping-list/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/commerce/shopping-list/route.ts)
  - `POST /api/commerce/shopping-list/items` at `apps/web/src/app/api/commerce/shopping-list/items/route.ts` (add or increment)
    - Body: `{ productId: string, quantity?: number }`
  - `PATCH /api/commerce/shopping-list/items/[itemId]` at `apps/web/src/app/api/commerce/shopping-list/items/[itemId]/route.ts` (set quantity; clamp 1–99)
    - Body: `{ quantity: number }`
  - `DELETE /api/commerce/shopping-list/items/[itemId]` at `apps/web/src/app/api/commerce/shopping-list/items/[itemId]/route.ts`
  - `POST /api/commerce/shopping-list/clear` at `apps/web/src/app/api/commerce/shopping-list/clear/route.ts`
- Continue to enrich items with product snapshot from [api/commerce/_data.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/commerce/_data.ts).

#### B3) Affiliate click tracking redirect

- Add `GET /api/commerce/redirect?productId=...` at `apps/web/src/app/api/commerce/redirect/route.ts`
  - Look up product via `findProduct(...)` in [api/commerce/_data.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/commerce/_data.ts)
  - Append a click event in store
  - Return `Response.redirect(product.affiliateUrl, 302)`
- Update UI links (“Beli”, “Buka tautan affiliate”) to use this redirect URL instead of direct affiliateUrl.

#### B4) Analytics computed from tracked clicks

- Update [affiliate-analytics/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/commerce/affiliate-analytics/route.ts) to compute:
  - `clicks` from stored events
  - `ctr`, `conversions`, `revenueIdr`, `commissionIdr` from deterministic mock formulas (documented in code):
    - `conversions = round(clicks * conversionRateByPeriod[period])`
    - `revenueIdr = conversions * avgOrderValueByProduct[productId]` (fallback to product price)
    - `commissionIdr = round(revenueIdr * commissionRate)`
  - `topProducts` derived from click counts (and computed conversions/revenue)

#### B5) Commerce UI upgrades (design system + interactions)

- Catalog:
  - Replace raw inputs with `Input`, `Select`, `Button`.
  - Add `apps/web/src/app/commerce/catalog/CatalogClient.tsx` to support “Add to list” per product card.
  - Keep server-rendered filters (query string) but do mutations client-side.
- Product detail:
  - Add `apps/web/src/app/commerce/products/[productId]/ProductClient.tsx` for “Add to shopping list” (qty + add) and tracked redirect.
- Shopping list:
  - Replace raw table with a `apps/web/src/app/commerce/shopping-list/ShoppingListClient.tsx`:
    - Inline qty editing (Input + buttons)
    - Remove item
    - Clear list
    - Buy uses tracked redirect
- Affiliate analytics:
  - Restyle KPI tiles using `Card` (reuse the same pattern used in Creator profile stats)
  - Optional: use `Table` component for top products (if added).

### Phase C — Clinic (Booking Flow)

#### C1) Add persistent store

- Add:
  - `apps/web/src/app/_lib/clinicStore.ts`
  - `apps/web/data/clinic-store.json`
- Store shape:
  - `bookings: Array<{ id, userId, expertId, serviceId, mode, startAt, endAt, status: "confirmed"|"cancelled", createdAt, notes?, contactName?, contactPhone? }>`
  - `updatedAt`

#### C2) Booking APIs

- Refactor shared expert/service data so booking endpoints can enrich responses without duplicating constants:
  - Add `apps/web/src/app/api/clinic/_experts.ts` exporting `EXPERTS` and helpers like `getExpertProfile(expertId)` and `getExpertService(expertId, serviceId)`.
  - Update existing [experts/[expertId]/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/clinic/experts/%5BexpertId%5D/route.ts) to import from `_experts.ts`.
- Add booking endpoints:
  - `apps/web/src/app/api/clinic/bookings/route.ts`
  - `GET /api/clinic/bookings?scope=upcoming|history|all` (default: `upcoming`)
    - Uses store + `Date.now()` to partition:
      - `upcoming`: `status==="confirmed"` and `startAt >= now`
      - `history`: `startAt < now` or `status==="cancelled"`
    - Enrich each booking with `expert` and `service` summaries (name, category, priceIdr, durationMinutes).
  - `POST /api/clinic/bookings` (create booking)
    - Body: `{ expertId, serviceId, mode, slotId, contactName?, contactPhone?, notes? }`
    - Slot validation:
      - Parse `slotId` format from current slots API (`slot-${date}-${HHmm}`).
      - Generate slots (same logic as slots route) and find the requested slot.
      - Reject if slot is unavailable OR another confirmed booking exists for same `expertId + mode + startAt`.
    - Persist a booking record with `status: "confirmed"`, `createdAt`, `userId: "usr_0001"`.
  - `POST /api/clinic/bookings/[bookingId]/cancel` at `apps/web/src/app/api/clinic/bookings/[bookingId]/cancel/route.ts`
    - Sets `status: "cancelled"` (idempotent if already cancelled).
- Update slots endpoint to reflect reservations:
  - Modify [booking/slots/route.ts](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/api/clinic/booking/slots/route.ts) to read store and mark `available=false` when reserved.

#### C3) Clinic UI upgrades

- Booking page:
  - Introduce `BookingClient.tsx` (“use client”) that:
    - Renders slots as selectable buttons/cards
    - Shows a confirmation panel with contact fields + notes
    - Calls `POST /api/clinic/bookings` and navigates to bookings history
  - Replace raw message/confirmation controls with shadcn `Input`, `Textarea`, `Button` and optional `Dialog` for confirm.
- Add bookings pages:
  - `apps/web/src/app/clinic/bookings/page.tsx` (upcoming list; calls `GET /api/clinic/bookings?scope=upcoming`)
  - `apps/web/src/app/clinic/bookings/history/page.tsx` (history list; calls `GET /api/clinic/bookings?scope=history`)
  - Add link cards from [clinic/page.tsx](file:///Users/antoniusjoshua/PARA/Project/trae/glowup/apps/web/src/app/clinic/page.tsx) so bookings/history are discoverable.

### Phase D — UI primitives (already available)

The repo already includes the primitives needed for this scope:

- `apps/web/src/components/ui/select.tsx`
- `apps/web/src/components/ui/table.tsx`
- `apps/web/src/components/ui/dialog.tsx`
- `apps/web/src/components/ui/alert-dialog.tsx`
- `apps/web/src/components/ui/sonner.tsx`

## Verification Steps (Executor Checklist)

- **Typecheck/build**: `pnpm -C apps/web build`
- **Lint**: `pnpm -C apps/web lint`
- **Smoke flows** (manual):
  - Intelligence:
    - Select goal/persona persists on refresh
    - Coach messages persist across refresh; reset works (if implemented)
  - Commerce:
    - Add/remove/qty shopping list persists
    - “Buy” uses tracking redirect and analytics numbers change after clicking
  - Clinic:
    - Book a slot → appears in booking history
    - Book same slot twice is rejected / marked unavailable in slots list
    - Cancel booking updates status and re-enables slot availability
