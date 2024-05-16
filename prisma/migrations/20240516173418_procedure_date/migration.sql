/*
  Warnings:

  - You are about to drop the column `date` on the `procedures` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `procedures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `procedures` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_procedures" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submiter_id" TEXT NOT NULL,
    "lab_id" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "subject" TEXT NOT NULL,
    "practice_name" TEXT NOT NULL,
    "students" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "procedures_submiter_id_fkey" FOREIGN KEY ("submiter_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "procedures_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_procedures" ("created_at", "id", "lab_id", "practice_name", "students", "subject", "submiter_id") SELECT "created_at", "id", "lab_id", "practice_name", "students", "subject", "submiter_id" FROM "procedures";
DROP TABLE "procedures";
ALTER TABLE "new_procedures" RENAME TO "procedures";
PRAGMA foreign_key_check("procedures");
PRAGMA foreign_keys=ON;
