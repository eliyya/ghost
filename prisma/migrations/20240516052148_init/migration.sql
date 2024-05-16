-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nc" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "labs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    CONSTRAINT "labs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tramits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tramiter_id" TEXT NOT NULL,
    "lab_id" TEXT NOT NULL,
    CONSTRAINT "tramits_tramiter_id_fkey" FOREIGN KEY ("tramiter_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tramits_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
