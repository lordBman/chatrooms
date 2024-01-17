/*
  Warnings:

  - The primary key for the `Members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Members` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "creatorID" INTEGER NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "posted" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachment" TEXT,
    CONSTRAINT "Room_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("attachment", "creatorID", "id", "isPrivate", "title") SELECT "attachment", "creatorID", "id", "isPrivate", "title" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE TABLE "new_Members" (
    "userID" INTEGER NOT NULL,
    "roomID" INTEGER NOT NULL,

    PRIMARY KEY ("userID", "roomID"),
    CONSTRAINT "Members_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Members_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Members" ("roomID", "userID") SELECT "roomID", "userID" FROM "Members";
DROP TABLE "Members";
ALTER TABLE "new_Members" RENAME TO "Members";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
