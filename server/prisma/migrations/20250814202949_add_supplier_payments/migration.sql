/*
  Warnings:

  - You are about to drop the column `date` on the `SupplierPayment` table. All the data in the column will be lost.
  - You are about to drop the column `operationNumber` on the `SupplierPayment` table. All the data in the column will be lost.
  - You are about to drop the column `operator` on the `SupplierPayment` table. All the data in the column will be lost.
  - You are about to drop the `_SaleToSupplierPayment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `SupplierPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `SupplierPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `SupplierPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SupplierPayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_SaleToSupplierPayment" DROP CONSTRAINT "_SaleToSupplierPayment_A_fkey";

-- DropForeignKey
ALTER TABLE "_SaleToSupplierPayment" DROP CONSTRAINT "_SaleToSupplierPayment_B_fkey";

-- DropIndex
DROP INDEX "SupplierPayment_operationNumber_key";

-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "status" SET DEFAULT 'confirmed';

-- AlterTable
ALTER TABLE "SupplierPayment" DROP COLUMN "date",
DROP COLUMN "operationNumber",
DROP COLUMN "operator",
ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "supplierId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "_SaleToSupplierPayment";

-- CreateTable
CREATE TABLE "_SupplierPaymentSales" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SupplierPaymentSales_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SupplierPaymentSales_B_index" ON "_SupplierPaymentSales"("B");

-- AddForeignKey
ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SupplierPaymentSales" ADD CONSTRAINT "_SupplierPaymentSales_A_fkey" FOREIGN KEY ("A") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SupplierPaymentSales" ADD CONSTRAINT "_SupplierPaymentSales_B_fkey" FOREIGN KEY ("B") REFERENCES "SupplierPayment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
