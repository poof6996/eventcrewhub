/*
  Warnings:

  - You are about to drop the column `rating` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `reviews` on the `suppliers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "rating",
DROP COLUMN "reviews";

-- CreateTable
CREATE TABLE "_SavedSuppliers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SavedSuppliers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SavedSuppliers_B_index" ON "_SavedSuppliers"("B");

-- AddForeignKey
ALTER TABLE "_SavedSuppliers" ADD CONSTRAINT "_SavedSuppliers_A_fkey" FOREIGN KEY ("A") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedSuppliers" ADD CONSTRAINT "_SavedSuppliers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
