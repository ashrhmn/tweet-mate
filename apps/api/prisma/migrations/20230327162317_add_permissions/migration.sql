/*
  Warnings:

  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PERMISSIONS" AS ENUM ('CREATE_USER', 'UPDATE_USER');

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_postId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permissions" "PERMISSIONS"[];

-- DropTable
DROP TABLE "Comments";

-- DropTable
DROP TABLE "Post";
