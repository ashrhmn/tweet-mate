-- CreateEnum
CREATE TYPE "PERMISSIONS" AS ENUM ('ADMIN_PERMISSION', 'READ_USER', 'CREATE_USER', 'MANAGE_USER', 'CREATE_PROJECT', 'MANAGE_PROJECT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "permissions" "PERMISSIONS"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberUser" (
    "id" TEXT NOT NULL,
    "discordUsername" TEXT NOT NULL,
    "discordDiscriminator" INTEGER NOT NULL,

    CONSTRAINT "MemberUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewTweetPost" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" TEXT,
    "media" TEXT[],

    CONSTRAINT "NewTweetPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExistingTweetPost" (
    "id" TEXT NOT NULL,
    "tweetUrl" TEXT NOT NULL,
    "retweetOfProjectId" TEXT,
    "likeOfProjectId" TEXT,

    CONSTRAINT "ExistingTweetPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RetweetedByMemberUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LikedByMemberUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_RetweetedByMemberUsers_AB_unique" ON "_RetweetedByMemberUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_RetweetedByMemberUsers_B_index" ON "_RetweetedByMemberUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LikedByMemberUsers_AB_unique" ON "_LikedByMemberUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedByMemberUsers_B_index" ON "_LikedByMemberUsers"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewTweetPost" ADD CONSTRAINT "NewTweetPost_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExistingTweetPost" ADD CONSTRAINT "ExistingTweetPost_retweetOfProjectId_fkey" FOREIGN KEY ("retweetOfProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExistingTweetPost" ADD CONSTRAINT "ExistingTweetPost_likeOfProjectId_fkey" FOREIGN KEY ("likeOfProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RetweetedByMemberUsers" ADD CONSTRAINT "_RetweetedByMemberUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ExistingTweetPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RetweetedByMemberUsers" ADD CONSTRAINT "_RetweetedByMemberUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "MemberUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedByMemberUsers" ADD CONSTRAINT "_LikedByMemberUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ExistingTweetPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedByMemberUsers" ADD CONSTRAINT "_LikedByMemberUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "MemberUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
