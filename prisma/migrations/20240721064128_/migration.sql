-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tools" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lab_id" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "tools_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tools" ("id", "lab_id", "name") SELECT "id", "lab_id", "name" FROM "tools";
DROP TABLE "tools";
ALTER TABLE "new_tools" RENAME TO "tools";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
