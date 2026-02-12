CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "lastActiveAt" TIMESTAMP NOT NULL
);

CREATE TABLE "UserProfile" (
  "userId" TEXT PRIMARY KEY,
  "displayName" TEXT NOT NULL,
  "timezone" TEXT NOT NULL,
  "onboardingCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
  "onboardingAnswersJson" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"("id")
);

CREATE TABLE "MagicLinkToken" (
  "token" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "consumed" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "Session" (
  "token" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id")
);

CREATE TABLE "ProtocolEnrollment" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "protocolId" TEXT NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE "DailyTask" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "protocolId" TEXT NOT NULL,
  "phaseId" TEXT NOT NULL,
  "dayKey" TEXT NOT NULL,
  "taskDefinitionId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "instructions" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "estimatedMinutes" INTEGER NOT NULL,
  "taskOrder" INTEGER NOT NULL,
  "required" BOOLEAN NOT NULL,
  "completed" BOOLEAN NOT NULL DEFAULT FALSE,
  "completedAt" TIMESTAMP
);

CREATE TABLE "Streak" (
  "userId" TEXT PRIMARY KEY,
  "currentStreak" INTEGER NOT NULL,
  "lastQualifiedDayKey" TEXT
);

CREATE TABLE "DailyCheckin" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "dayKey" TEXT NOT NULL,
  "focus" INTEGER NOT NULL,
  "calm" INTEGER NOT NULL,
  "energy" INTEGER NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP NOT NULL
);

CREATE TABLE "AssistantConversation" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "protocolId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL
);

CREATE TABLE "AssistantMessage" (
  "id" TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "inputTokens" INTEGER,
  "outputTokens" INTEGER
);
