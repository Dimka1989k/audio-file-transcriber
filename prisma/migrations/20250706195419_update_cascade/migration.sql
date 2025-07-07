-- DropForeignKey
ALTER TABLE "Transcription" DROP CONSTRAINT "Transcription_userId_fkey";

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
