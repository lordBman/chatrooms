-- CreateTable
CREATE TABLE "Profile" (
    "userID" INTEGER NOT NULL,
    "description" TEXT,
    "path" TEXT,
    CONSTRAINT "Profile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userID_key" ON "Profile"("userID");
