/*
  Warnings:

  - A unique constraint covering the columns `[slurg]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Made the column `like` on table `CommentLikes` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CommentLikes" (
    "userID" INTEGER NOT NULL,
    "commentID" INTEGER NOT NULL,
    "like" BOOLEAN NOT NULL,

    PRIMARY KEY ("userID", "commentID"),
    CONSTRAINT "CommentLikes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentLikes_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "Comment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CommentLikes" ("commentID", "like", "userID") SELECT "commentID", "like", "userID" FROM "CommentLikes";
DROP TABLE "CommentLikes";
ALTER TABLE "new_CommentLikes" RENAME TO "CommentLikes";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slurg_key" ON "Tag"("slurg");
