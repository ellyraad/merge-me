-- DropForeignKey
ALTER TABLE "public"."UserJobTitle" DROP CONSTRAINT "UserJobTitle_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProgrammingLanguage" DROP CONSTRAINT "UserProgrammingLanguage_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserJobTitle" ADD CONSTRAINT "UserJobTitle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgrammingLanguage" ADD CONSTRAINT "UserProgrammingLanguage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
