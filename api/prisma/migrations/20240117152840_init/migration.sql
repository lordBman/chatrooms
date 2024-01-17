/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "RoomLikes" (
    "userID" INTEGER NOT NULL,
    "roomID" INTEGER NOT NULL,
    "like" BOOLEAN,

    PRIMARY KEY ("userID", "roomID"),
    CONSTRAINT "RoomLikes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoomLikes_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommentLikes" (
    "userID" INTEGER NOT NULL,
    "commentID" INTEGER NOT NULL,
    "like" BOOLEAN,

    PRIMARY KEY ("userID", "commentID"),
    CONSTRAINT "CommentLikes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentLikes_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "Comment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
