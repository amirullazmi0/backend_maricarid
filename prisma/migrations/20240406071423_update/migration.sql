/*
  Warnings:

  - Made the column `images` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `images` on table `events` required. This step will fail if there are existing NULL values in that column.
  - Made the column `images` on table `socmeds` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `clients` MODIFY `images` JSON NOT NULL;

-- AlterTable
ALTER TABLE `events` MODIFY `images` JSON NOT NULL;

-- AlterTable
ALTER TABLE `socmeds` MODIFY `images` JSON NOT NULL;
