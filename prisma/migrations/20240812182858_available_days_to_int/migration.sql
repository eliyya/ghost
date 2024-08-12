/*
  Warnings:

  - You are about to alter the column `available_days` on the `labs` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_labs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "open_date" DATETIME NOT NULL,
    "close_date" DATETIME NOT NULL,
    "available_days" INTEGER NOT NULL DEFAULT 62
);
INSERT INTO "new_labs" ("available_days", "close_date", "id", "name", "open_date") SELECT "available_days", "close_date", "id", "name", "open_date" FROM "labs";
DROP TABLE "labs";
ALTER TABLE "new_labs" RENAME TO "labs";
CREATE UNIQUE INDEX "labs_name_key" ON "labs"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
