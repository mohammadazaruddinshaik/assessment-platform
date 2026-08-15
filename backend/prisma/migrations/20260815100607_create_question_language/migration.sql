-- CreateTable
CREATE TABLE "QuestionLanguage" (
    "questionId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionLanguage_pkey" PRIMARY KEY ("questionId","languageId")
);

-- CreateIndex
CREATE INDEX "QuestionLanguage_languageId_idx" ON "QuestionLanguage"("languageId");

-- AddForeignKey
ALTER TABLE "QuestionLanguage" ADD CONSTRAINT "QuestionLanguage_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLanguage" ADD CONSTRAINT "QuestionLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
