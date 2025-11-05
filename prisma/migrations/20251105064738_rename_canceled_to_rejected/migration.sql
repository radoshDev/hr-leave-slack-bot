/*
  Warnings:

  - The values [CANCELED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');
ALTER TABLE "public"."LeaveRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
