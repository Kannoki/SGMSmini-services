-- AlterTable
ALTER TABLE "ScheduledJob"
ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Untitled Cron',
ADD COLUMN "code" TEXT;

-- Backfill existing rows
UPDATE "ScheduledJob"
SET "code" = "id"
WHERE "code" IS NULL;

-- Enforce not-null after backfill
ALTER TABLE "ScheduledJob"
ALTER COLUMN "code" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledJob_code_key" ON "ScheduledJob"("code");
