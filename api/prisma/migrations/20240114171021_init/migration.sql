-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    CONSTRAINT "Session_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_userID_key" ON "Session"("userID");
