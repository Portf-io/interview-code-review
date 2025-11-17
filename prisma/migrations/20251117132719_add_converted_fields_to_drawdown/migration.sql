/*
  Warnings:

  - Added the required column `updatedAt` to the `Drawdown` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drawdown" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "convertedAmount" REAL,
    "convertedCurrency" TEXT,
    "investmentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Drawdown_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Drawdown" ("amount", "createdAt", "currency", "id", "investmentId", "updatedAt") SELECT "amount", "createdAt", "currency", "id", "investmentId", "createdAt" FROM "Drawdown";
DROP TABLE "Drawdown";
ALTER TABLE "new_Drawdown" RENAME TO "Drawdown";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
