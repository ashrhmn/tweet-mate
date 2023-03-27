/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "projects_url_key" ON "projects"("url");
