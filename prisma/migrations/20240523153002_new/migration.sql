-- CreateTable
CREATE TABLE `users` (
    `email` VARCHAR(100) NOT NULL,
    `fullName` VARCHAR(200) NOT NULL,
    `password` VARCHAR(250) NOT NULL,
    `token` VARCHAR(250) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_fullName_key`(`fullName`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `desc` VARCHAR(1000) NULL,
    `images` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `events_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `desc` VARCHAR(1000) NULL,
    `images` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clients_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `socmeds` (
    `name` VARCHAR(100) NOT NULL,
    `link` VARCHAR(250) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `socmeds_name_key`(`name`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `name` VARCHAR(100) NOT NULL,
    `desc` VARCHAR(1000) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `profiles_name_key`(`name`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
