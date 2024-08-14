/*
  Warnings:

  - You are about to drop the `_ProcedureToTool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ProcedureToTool";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "used_tools" (
    "procedure_id" TEXT NOT NULL,
    "tool_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("procedure_id", "tool_id"),
    CONSTRAINT "used_tools_procedure_id_fkey" FOREIGN KEY ("procedure_id") REFERENCES "procedures" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "used_tools_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
