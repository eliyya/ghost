-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_labs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "open_date" DATETIME NOT NULL,
    "close_date" DATETIME NOT NULL,
    "available_days" TEXT NOT NULL DEFAULT '0111110'
);
INSERT INTO "new_labs" ("close_date", "id", "name", "open_date") SELECT "close_date", "id", "name", "open_date" FROM "labs";
DROP TABLE "labs";
ALTER TABLE "new_labs" RENAME TO "labs";
CREATE UNIQUE INDEX "labs_name_key" ON "labs"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
