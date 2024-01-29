/*
  Warnings:

  - Made the column `like` on table `RoomLikes` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoomLikes" (
    "userID" INTEGER NOT NULL,
    "roomID" INTEGER NOT NULL,
    "like" BOOLEAN NOT NULL,

    PRIMARY KEY ("userID", "roomID"),
    CONSTRAINT "RoomLikes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoomLikes_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RoomLikes" ("like", "roomID", "userID") SELECT "like", "roomID", "userID" FROM "RoomLikes";
DROP TABLE "RoomLikes";
ALTER TABLE "new_RoomLikes" RENAME TO "RoomLikes";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
