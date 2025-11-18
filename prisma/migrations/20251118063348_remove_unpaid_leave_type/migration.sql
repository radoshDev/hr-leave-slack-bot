/*
  Warnings:

  - The values [UNPAID] on the enum `LeaveType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeaveType_new" AS ENUM ('VACATION', 'SICK_LEAVE');
ALTER TABLE "public"."LeaveRequest" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "LeaveRequest" ALTER COLUMN "type" TYPE "LeaveType_new" USING ("type"::text::"LeaveType_new");
ALTER TYPE "LeaveType" RENAME TO "LeaveType_old";
ALTER TYPE "LeaveType_new" RENAME TO "LeaveType";
DROP TYPE "public"."LeaveType_old";
ALTER TABLE "LeaveRequest" ALTER COLUMN "type" SET DEFAULT 'VACATION';
COMMIT;
