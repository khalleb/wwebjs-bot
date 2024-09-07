/*
  Warnings:

  - You are about to drop the column `name` on the `session-whatsapp` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[session]` on the table `session-whatsapp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `session` to the `session-whatsapp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session-whatsapp" DROP COLUMN "name",
ADD COLUMN     "session" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "session-whatsapp_session_key" ON "session-whatsapp"("session");
