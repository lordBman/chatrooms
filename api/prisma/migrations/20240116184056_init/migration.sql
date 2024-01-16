-- CreateTable
CREATE TABLE "Tag" (
    "slurp" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roomID" INTEGER NOT NULL,
    CONSTRAINT "Tag_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slurp_key" ON "Tag"("slurp");
