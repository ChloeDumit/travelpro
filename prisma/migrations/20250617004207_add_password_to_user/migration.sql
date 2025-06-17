-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'sales', 'finance');

-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('individual', 'corporate', 'sports', 'group');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('national', 'international', 'regional');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('flight', 'hotel', 'package', 'transfer', 'excursion', 'insurance', 'other');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('draft', 'confirmed', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'local');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('pending', 'confirmed', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('creditCard', 'cash', 'transfer');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "passengerName" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "saleType" "SaleType" NOT NULL,
    "region" "Region" NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "status" "SaleStatus" NOT NULL DEFAULT 'draft',
    "currency" "Currency" NOT NULL,
    "sellerId" TEXT NOT NULL,
    "passengerCount" INTEGER NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "dateIn" TIMESTAMP(3) NOT NULL,
    "dateOut" TIMESTAMP(3) NOT NULL,
    "passengerCount" INTEGER NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'pending',
    "description" TEXT NOT NULL,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "saleCurrency" "Currency" NOT NULL,
    "costPrice" DOUBLE PRECISION NOT NULL,
    "costCurrency" "Currency" NOT NULL,
    "reservationCode" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "saleId" TEXT NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierPayment" (
    "id" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operationNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "paymentMethod" TEXT NOT NULL,

    CONSTRAINT "SupplierPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SaleToSupplierPayment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SaleToSupplierPayment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierPayment_operationNumber_key" ON "SupplierPayment"("operationNumber");

-- CreateIndex
CREATE INDEX "_SaleToSupplierPayment_B_index" ON "_SaleToSupplierPayment"("B");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SaleToSupplierPayment" ADD CONSTRAINT "_SaleToSupplierPayment_A_fkey" FOREIGN KEY ("A") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SaleToSupplierPayment" ADD CONSTRAINT "_SaleToSupplierPayment_B_fkey" FOREIGN KEY ("B") REFERENCES "SupplierPayment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
