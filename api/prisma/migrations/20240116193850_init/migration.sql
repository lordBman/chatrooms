/*
  Warnings:

  - You are about to drop the column `slurp` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `slurg` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slurg" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roomID" INTEGER NOT NULL,
    CONSTRAINT "Tag_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("id", "name", "roomID") SELECT "id", "name", "roomID" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
