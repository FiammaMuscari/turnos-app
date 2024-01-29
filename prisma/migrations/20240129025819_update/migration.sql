/*
  Warnings:

  - You are about to drop the `_AppointmentToService` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AppointmentToService" DROP CONSTRAINT "_AppointmentToService_A_fkey";

-- DropForeignKey
ALTER TABLE "_AppointmentToService" DROP CONSTRAINT "_AppointmentToService_B_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "services" TEXT[],
ALTER COLUMN "date" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "_AppointmentToService";
