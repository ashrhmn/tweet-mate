/*
  Warnings:

  - You are about to drop the `ExistingTweetPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NewTweetPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExistingTweetPost" DROP CONSTRAINT "ExistingTweetPost_likeOfProjectId_fkey";

-- DropForeignKey
ALTER TABLE "ExistingTweetPost" DROP CONSTRAINT "ExistingTweetPost_retweetOfProjectId_fkey";

-- DropForeignKey
ALTER TABLE "NewTweetPost" DROP CONSTRAINT "NewTweetPost_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "_LikedByMemberUsers" DROP CONSTRAINT "_LikedByMemberUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikedByMemberUsers" DROP CONSTRAINT "_LikedByMemberUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "_RetweetedByMemberUsers" DROP CONSTRAINT "_RetweetedByMemberUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_RetweetedByMemberUsers" DROP CONSTRAINT "_RetweetedByMemberUsers_B_fkey";

-- DropTable
DROP TABLE "ExistingTweetPost";

-- DropTable
DROP TABLE "MemberUser";

-- DropTable
DROP TABLE "NewTweetPost";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "permissions" "PERMISSIONS"[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_users" (
    "id" TEXT NOT NULL,
    "discord_username" TEXT NOT NULL,
    "discord_discriminator" INTEGER NOT NULL,

    CONSTRAINT "member_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "new_tweet_posts" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "content" TEXT,
    "media" TEXT[],

    CONSTRAINT "new_tweet_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "existing_tweet_posts" (
    "id" TEXT NOT NULL,
    "tweet_url" TEXT NOT NULL,
    "retweet_of_project_id" TEXT,
    "like_of_project_id" TEXT,

    CONSTRAINT "existing_tweet_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "member_users_discord_username_discord_discriminator_key" ON "member_users"("discord_username", "discord_discriminator");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "new_tweet_posts" ADD CONSTRAINT "new_tweet_posts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "existing_tweet_posts" ADD CONSTRAINT "existing_tweet_posts_retweet_of_project_id_fkey" FOREIGN KEY ("retweet_of_project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "existing_tweet_posts" ADD CONSTRAINT "existing_tweet_posts_like_of_project_id_fkey" FOREIGN KEY ("like_of_project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RetweetedByMemberUsers" ADD CONSTRAINT "_RetweetedByMemberUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "existing_tweet_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RetweetedByMemberUsers" ADD CONSTRAINT "_RetweetedByMemberUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "member_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedByMemberUsers" ADD CONSTRAINT "_LikedByMemberUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "existing_tweet_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedByMemberUsers" ADD CONSTRAINT "_LikedByMemberUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "member_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
