# PIX-21 — Phase 1.1 UX Stabilization

## Status: In Progress

## Assessment of 9 Items

| Item | Status |
|------|--------|
| Loading states for async pages/panels | PARTIAL — text exists, needs LoadingSpinner component |
| Empty states (protocol list, tracking history, assistant) | PARTIAL — bare text, needs EmptyState component |
| Standardized feedback banners | DONE ✓ FeedbackBanner exists + used everywhere |
| Inline form validation messages | PARTIAL — assistant needs empty-input validation |
| Assistant typing indicator | DONE ✓ exists (text-only), keep as-is |
| Lightweight task completion animations | MISSING — needs visual feedback on toggle |
| Protocol detail phase expand/collapse | DONE ✓ HTML `<details>` already in ProtocolPhaseBlock |
| Improved onboarding clarity | PARTIAL — copy on protocol detail is minimal |
| Consistent button disabled/loading behavior | PARTIAL — disabled works, loading label missing |

## Tasks

- [ ] Create `src/ui/components/LoadingSpinner.tsx` — animated dots component
- [ ] Create `src/ui/components/EmptyState.tsx` — message + optional description
- [ ] Update `app/(app)/today/today-client.tsx` — use LoadingSpinner + task completing animation
- [ ] Update `app/(app)/tracking/tracking-client.tsx` — use LoadingSpinner + EmptyState + button loading label
- [ ] Update `app/(app)/assistant/assistant-client.tsx` — use EmptyState + inline validation + button loading label
- [ ] Update `src/components/protocol/ProtocolEnrollButton.tsx` — button loading label ("Enrolling...")
- [ ] Update `app/protocol/page.tsx` — improve onboarding copy
- [ ] Run `npm run build` — verify clean build
- [ ] Run tests — verify no regressions

## Review

_To be filled after completion._
