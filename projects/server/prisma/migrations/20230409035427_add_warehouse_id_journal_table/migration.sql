/*
  Warnings:

  - You are about to drop the `productcategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `useraddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `warehouseId` to the `Journal` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE `Journal` ADD COLUMN `warehouseId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Journal` ADD CONSTRAINT `Journal_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
