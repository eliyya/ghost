-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ne" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "labs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "open_date" DATETIME NOT NULL,
    "close_date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "procedures" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submiter_id" TEXT NOT NULL,
    "lab_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "subject" TEXT NOT NULL,
    "practice_name" TEXT NOT NULL,
    "students" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "procedures_submiter_id_fkey" FOREIGN KEY ("submiter_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "procedures_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "admin_labs" (
    "user_id" TEXT NOT NULL,
    "lab_id" TEXT NOT NULL,

    PRIMARY KEY ("user_id", "lab_id"),
    CONSTRAINT "admin_labs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "admin_labs_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_ne_key" ON "users"("ne");

-- CreateIndex
CREATE UNIQUE INDEX "labs_name_key" ON "labs"("name");
