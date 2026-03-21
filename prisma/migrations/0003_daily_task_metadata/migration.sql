-- Add task metadata fields to DailyTask
-- Previously only mutable state (completed/completedAt) was stored.
-- Now we persist the full DailyTaskInstance to avoid relying on an in-memory cache.

ALTER TABLE "DailyTask"
  ADD COLUMN "protocolId"       TEXT NOT NULL DEFAULT '',
  ADD COLUMN "phaseId"          TEXT NOT NULL DEFAULT '',
  ADD COLUMN "taskDefinitionId" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "title"            TEXT NOT NULL DEFAULT '',
  ADD COLUMN "instructions"     TEXT NOT NULL DEFAULT '',
  ADD COLUMN "category"         TEXT NOT NULL DEFAULT '',
  ADD COLUMN "estimatedMinutes" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "required"         BOOLEAN NOT NULL DEFAULT true;
