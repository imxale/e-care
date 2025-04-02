/*
  Warnings:

  - You are about to drop the column `id_auth` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_id_auth_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "id_auth";

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");
