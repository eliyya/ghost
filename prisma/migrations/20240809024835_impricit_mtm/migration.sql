/*
  Warnings:

  - You are about to drop the `procedures_tools` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "procedures_tools";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_ProcedureToTool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProcedureToTool_A_fkey" FOREIGN KEY ("A") REFERENCES "procedures" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProcedureToTool_B_fkey" FOREIGN KEY ("B") REFERENCES "tools" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tools" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lab_id" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "tools_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tools" ("id", "lab_id", "name", "stock") SELECT "id", "lab_id", "name", "stock" FROM "tools";
DROP TABLE "tools";
ALTER TABLE "new_tools" RENAME TO "tools";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ProcedureToTool_AB_unique" ON "_ProcedureToTool"("A", "B");

-- CreateIndex
CREATE INDEX "_ProcedureToTool_B_index" ON "_ProcedureToTool"("B");
