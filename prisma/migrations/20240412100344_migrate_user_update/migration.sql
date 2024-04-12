/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users_id_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `email` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`email`);

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);
