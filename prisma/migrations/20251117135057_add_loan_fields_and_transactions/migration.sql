-- AlterTable
ALTER TABLE "Investment" ADD COLUMN "compoundingFrequency" TEXT;
ALTER TABLE "Investment" ADD COLUMN "interestRate" REAL;
ALTER TABLE "Investment" ADD COLUMN "lastCalculatedAt" DATETIME;
ALTER TABLE "Investment" ADD COLUMN "latestAccruedInterest" REAL;
ALTER TABLE "Investment" ADD COLUMN "startDate" DATETIME;

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
