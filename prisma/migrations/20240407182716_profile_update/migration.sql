/*
  Warnings:

  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `profiles` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `VarChar(100)`.
  - A unique constraint covering the columns `[name]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `profiles_id_key` ON `profiles`;

-- AlterTable
ALTER TABLE `profiles` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `name` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`name`);

-- CreateIndex
CREATE UNIQUE INDEX `profiles_name_key` ON `profiles`(`name`);
