/*
  Warnings:

  - You are about to drop the `productcategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `useraddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouse` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateTable
CREATE TABLE `Type_Journal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Journal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stock_before` INTEGER NOT NULL,
    `stock_after` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `productId` INTEGER NOT NULL,
    `typeId` INTEGER NOT NULL,

    INDEX `Journal_productId_fkey`(`productId`),
    INDEX `Journal_typeId_fkey`(`typeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Journal` ADD CONSTRAINT `Journal_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Journal` ADD CONSTRAINT `Journal_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `Type_Journal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
