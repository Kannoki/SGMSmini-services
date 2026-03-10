-- CreateTable
CREATE TABLE "Letter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "recipientEmails" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ScheduledJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "letterId" TEXT NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "recipientEmails" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastRunAt" DATETIME,
    "nextRunAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ScheduledJob_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "Letter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
