# PIX-31 — Phase 2.1 Nervous System Assessment (Intake Quiz)

## Status: In Progress

## Plan

### Domain
- [ ] `src/domain/assessment/types.ts` — NervousSystemType, AssessmentResponses, AssessmentScores, AssessmentResult
- [ ] `src/domain/assessment/scoring.ts` — pure computeAssessment(responses) function
- [ ] Update `src/domain/entities/user.ts` — extend OnboardingResponse to include optional AssessmentResult fields
- [ ] Update `src/domain/repositories/user-repository.ts` — add saveAssessment method

### Infrastructure
- [ ] Update `src/infrastructure/db/repositories/prisma-user-repository.ts` — implement saveAssessment

### API
- [ ] `app/api/assessment/route.ts` — POST (submit + score + save), GET (retrieve result)

### UI
- [ ] `app/(app)/assessment/page.tsx` — multi-step 12-question form (client component)
- [ ] `app/(app)/assessment/results/page.tsx` — type + explanation + top symptoms + recommendation

### Verification
- [ ] Build passes: npm run build
- [ ] Tests pass: npm test

## Tasks

- [ ] Write types
- [ ] Write scoring function
- [ ] Update domain + repository interface
- [ ] Update Prisma repository
- [ ] Create API endpoint
- [ ] Create assessment form page
- [ ] Create results page
- [ ] Verify build + tests

## Review

(to be filled after completion)
