-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "image" TEXT,
    "bio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobTitle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserJobTitle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobTitleId" TEXT NOT NULL,

    CONSTRAINT "UserJobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgrammingLanguage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProgrammingLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgrammingLanguage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programmingLanguageId" TEXT NOT NULL,

    CONSTRAINT "UserProgrammingLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "JobTitle_name_key" ON "JobTitle"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserJobTitle_userId_jobTitleId_key" ON "UserJobTitle"("userId", "jobTitleId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgrammingLanguage_name_key" ON "ProgrammingLanguage"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgrammingLanguage_userId_programmingLanguageId_key" ON "UserProgrammingLanguage"("userId", "programmingLanguageId");

-- AddForeignKey
ALTER TABLE "UserJobTitle" ADD CONSTRAINT "UserJobTitle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJobTitle" ADD CONSTRAINT "UserJobTitle_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgrammingLanguage" ADD CONSTRAINT "UserProgrammingLanguage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgrammingLanguage" ADD CONSTRAINT "UserProgrammingLanguage_programmingLanguageId_fkey" FOREIGN KEY ("programmingLanguageId") REFERENCES "ProgrammingLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
