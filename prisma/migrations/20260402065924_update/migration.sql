-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_studentId_fkey";

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
