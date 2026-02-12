## Auth Repository
- **Interface**
  - `src/domain/repositories/auth-repository.ts`
  - `AuthRepository`
  - Methods: `createMagicLinkToken`, `consumeMagicLinkToken`, `createSession`, `getSession`, `revokeSession`
- **In-memory implementation**
  - `src/infrastructure/db/repositories/in-memory-auth-repository.ts`
  - `InMemoryAuthRepository implements AuthRepository`
  - Backing store keys used: `magicTokens`, `sessions` from `src/infrastructure/db/repositories/memory-store.ts`
- **Instantiation / DI wiring**
  - Instantiated in singleton registry: `src/infrastructure/db/repositories/index.ts` as `repositories.auth = new InMemoryAuthRepository()`
  - Used directly via imported `repositories` object
- **API routes depending on this repository**
  - `app/api/auth/request-link/route.ts` (`createMagicLinkToken`)
  - `app/api/auth/verify/route.ts` (`consumeMagicLinkToken`, `createSession`)
- **Other wiring usage (non-API route)**
  - `src/infrastructure/auth/session.ts` (`getSession`, `revokeSession`)

## User Repository
- **Interface**
  - `src/domain/repositories/user-repository.ts`
  - `UserRepository`
  - Methods: `getByEmail`, `getById`, `create`, `touch`, `getProfile`, `upsertProfile`, `saveOnboarding`
- **In-memory implementation**
  - `src/infrastructure/db/repositories/in-memory-user-repository.ts`
  - `InMemoryUserRepository implements UserRepository`
  - Backing store keys used: `users`, `profiles`
- **Instantiation / DI wiring**
  - `src/infrastructure/db/repositories/index.ts` as `repositories.user = new InMemoryUserRepository()`
  - Passed into use-cases from route handlers where needed
- **API routes depending on this repository**
  - `app/api/auth/request-link/route.ts` (`getByEmail`, `create`)
  - `app/api/auth/verify/route.ts` (`touch`)
  - `app/api/profile/route.ts` (`getProfile`, `upsertProfile`)
  - `app/api/onboarding/route.ts` (`saveOnboarding`)
  - `app/api/today/route.ts` (injected into `getTodayView` as `userRepository`)
  - `app/api/assistant/message/route.ts` (injected into `getTodayView` as `userRepository`)

## Protocol Repository
- **Interface**
  - `src/domain/repositories/protocol-repository.ts`
  - `ProtocolRepository`
  - Methods: template lookup/listing, enrollment, daily task materialization/toggle, streak read/write
- **In-memory implementation**
  - `src/infrastructure/db/repositories/in-memory-protocol-repository.ts`
  - `InMemoryProtocolRepository implements ProtocolRepository`
  - Backing store keys used: `enrollments`, `dailyTasks`, `streaks`
  - Also reads static templates from `src/protocol-engine/definitions/templates.ts`
- **Instantiation / DI wiring**
  - `src/infrastructure/db/repositories/index.ts` as `repositories.protocol = new InMemoryProtocolRepository()`
  - Injected into use-cases from API routes (`getTodayView`, `toggleTask`, `bootstrapEnrollment`)
- **API routes depending on this repository**
  - `app/api/protocol/templates/route.ts` (`listTemplates`)
  - `app/api/protocol/current/route.ts` (injected into `bootstrapEnrollment`, then `getTemplateById`)
  - `app/api/today/route.ts` (injected into `getTodayView`)
  - `app/api/tasks/[id]/toggle/route.ts` (injected into `toggleTask`)
  - `app/api/assistant/message/route.ts` (injected into `getTodayView`, plus direct `getActiveEnrollment`)

## Tracking Repository
- **Interface**
  - `src/domain/repositories/tracking-repository.ts`
  - `TrackingRepository`
  - Methods: `upsertDailyCheckin`, `getHistory`, `getLatest`
- **In-memory implementation**
  - `src/infrastructure/db/repositories/in-memory-tracking-repository.ts`
  - `InMemoryTrackingRepository implements TrackingRepository`
  - Backing store key used: `checkins`
- **Instantiation / DI wiring**
  - `src/infrastructure/db/repositories/index.ts` as `repositories.tracking = new InMemoryTrackingRepository()`
  - Injected into use-cases from route handlers
- **API routes depending on this repository**
  - `app/api/tracking/daily/route.ts` (injected into `submitDailyCheckin`)
  - `app/api/tracking/history/route.ts` (injected into `getTrackingHistory`)
  - `app/api/today/route.ts` (injected into `getTodayView`)
  - `app/api/assistant/message/route.ts` (injected into `getTodayView`)

## Conversation Repository
- **Interface**
  - `src/domain/repositories/conversation-repository.ts`
  - `ConversationRepository`
  - Methods: `getOrCreateConversation`, `listMessages`, `addMessage`
- **In-memory implementation**
  - `src/infrastructure/db/repositories/in-memory-conversation-repository.ts`
  - `InMemoryConversationRepository implements ConversationRepository`
  - Backing store keys used: `conversations`, `messages`
- **Instantiation / DI wiring**
  - `src/infrastructure/db/repositories/index.ts` as `repositories.conversation = new InMemoryConversationRepository()`
  - Injected into assistant service constructor
- **API routes depending on this repository**
  - `app/api/assistant/message/route.ts` via:
    - `const assistantService = new NeuroforgeAssistantService(repositories.conversation, new OpenAIProvider())`

## DI / Factory Wiring Summary
- **Central wiring point**
  - `src/infrastructure/db/repositories/index.ts`
  - Exports singleton `repositories` object with concrete in-memory instances:
    - `auth`, `conversation`, `protocol`, `tracking`, `user`
- **State backing**
  - `src/infrastructure/db/repositories/memory-store.ts`
  - Process-local singleton store returned by `getMemoryStore()`, shared by all in-memory repositories
- **Injection style**
  - Route handlers import `repositories` and either:
    - call repository methods directly, or
    - pass repository instances into application use-cases/services as arguments (manual DI).
