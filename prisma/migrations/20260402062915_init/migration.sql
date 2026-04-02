-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN', 'APPLICANT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY_FOR_PICKUP', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentFor" AS ENUM ('ADMISSION', 'FORM_FILLUP', 'EXAM', 'TRANSCRIPT', 'CERTIFICATE', 'TESTIMONIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "NoticeType" AS ENUM ('GENERAL', 'CLASS_SPECIFIC');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "nameBn" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "guardianMobile" TEXT NOT NULL,
    "studentMobile" TEXT,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "birthCertificateNo" TEXT NOT NULL,
    "presentAddress" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "previousSchool" TEXT,
    "desiredClass" TEXT NOT NULL,
    "admissionYear" TEXT NOT NULL,
    "examRoll" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "signatureImage" TEXT,

    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'APPLICANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "needPasswordChange" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classSubject" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "classSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentRequest" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" "PaymentFor" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "applyDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentId" TEXT,

    CONSTRAINT "documentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "formFillupStart" TIMESTAMP(3) NOT NULL,
    "formFillupEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formFillup" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "classRoll" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "formFillup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "sectionName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "NoticeType" NOT NULL DEFAULT 'GENERAL',
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticeClass" (
    "id" TEXT NOT NULL,
    "noticeId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "noticeClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "paymentFor" "PaymentFor" NOT NULL,
    "studentId" TEXT NOT NULL,
    "applicationId" TEXT,
    "formFillupId" TEXT,
    "documentRequestId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" TEXT,
    "transactionId" TEXT,
    "stripeEventId" TEXT,
    "paidAt" TIMESTAMP(3),
    "invoiceUrl" TEXT,
    "paymentGatewayData" JSONB,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "admissionStart" TIMESTAMP(3) NOT NULL,
    "admissionEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "marks" DOUBLE PRECISION NOT NULL,
    "grade" TEXT,

    CONSTRAINT "result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine" (
    "id" TEXT NOT NULL,
    "day" "Day" NOT NULL,
    "classId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "timeSlotId" TEXT NOT NULL,

    CONSTRAINT "routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "nameBn" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "guardianMobile" TEXT NOT NULL,
    "presentAddress" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "religion" TEXT,
    "birthCertificateNo" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentClassHistory" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "year" TEXT NOT NULL,

    CONSTRAINT "studentClassHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacherSubject" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "teacherSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeSlot" (
    "id" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "timeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_birthCertificateNo_key" ON "application"("birthCertificateNo");

-- CreateIndex
CREATE UNIQUE INDEX "application_examRoll_key" ON "application"("examRoll");

-- CreateIndex
CREATE INDEX "application_status_idx" ON "application"("status");

-- CreateIndex
CREATE INDEX "application_examRoll_idx" ON "application"("examRoll");

-- CreateIndex
CREATE INDEX "application_admissionYear_idx" ON "application"("admissionYear");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "class_programId_idx" ON "class"("programId");

-- CreateIndex
CREATE INDEX "classSubject_classId_idx" ON "classSubject"("classId");

-- CreateIndex
CREATE INDEX "classSubject_subjectId_idx" ON "classSubject"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "classSubject_classId_subjectId_key" ON "classSubject"("classId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "documentRequest_paymentId_key" ON "documentRequest"("paymentId");

-- CreateIndex
CREATE INDEX "documentRequest_status_idx" ON "documentRequest"("status");

-- CreateIndex
CREATE INDEX "documentRequest_studentId_idx" ON "documentRequest"("studentId");

-- CreateIndex
CREATE INDEX "exam_year_idx" ON "exam"("year");

-- CreateIndex
CREATE INDEX "formFillup_studentId_idx" ON "formFillup"("studentId");

-- CreateIndex
CREATE INDEX "formFillup_classId_idx" ON "formFillup"("classId");

-- CreateIndex
CREATE INDEX "formFillup_examId_idx" ON "formFillup"("examId");

-- CreateIndex
CREATE INDEX "formFillup_status_idx" ON "formFillup"("status");

-- CreateIndex
CREATE UNIQUE INDEX "media_key_key" ON "media"("key");

-- CreateIndex
CREATE INDEX "media_sectionName_idx" ON "media"("sectionName");

-- CreateIndex
CREATE INDEX "notice_type_idx" ON "notice"("type");

-- CreateIndex
CREATE INDEX "notice_createdAt_idx" ON "notice"("createdAt");

-- CreateIndex
CREATE INDEX "noticeClass_classId_idx" ON "noticeClass"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "noticeClass_noticeId_classId_key" ON "noticeClass"("noticeId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_applicationId_key" ON "payment"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_formFillupId_key" ON "payment"("formFillupId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_documentRequestId_key" ON "payment"("documentRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactionId_key" ON "payment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_stripeEventId_key" ON "payment"("stripeEventId");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");

-- CreateIndex
CREATE INDEX "payment_paymentFor_idx" ON "payment"("paymentFor");

-- CreateIndex
CREATE INDEX "payment_transactionId_idx" ON "payment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "program_name_key" ON "program"("name");

-- CreateIndex
CREATE INDEX "program_name_idx" ON "program"("name");

-- CreateIndex
CREATE INDEX "result_studentId_idx" ON "result"("studentId");

-- CreateIndex
CREATE INDEX "result_examId_idx" ON "result"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "result_studentId_subjectId_examId_key" ON "result"("studentId", "subjectId", "examId");

-- CreateIndex
CREATE INDEX "routine_day_idx" ON "routine"("day");

-- CreateIndex
CREATE INDEX "routine_classId_idx" ON "routine"("classId");

-- CreateIndex
CREATE INDEX "routine_teacherId_idx" ON "routine"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "routine_day_timeSlotId_teacherId_key" ON "routine"("day", "timeSlotId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "routine_day_timeSlotId_classId_key" ON "routine"("day", "timeSlotId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "student_registrationId_key" ON "student"("registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "student_userId_key" ON "student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "student_applicationId_key" ON "student"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "student_birthCertificateNo_key" ON "student"("birthCertificateNo");

-- CreateIndex
CREATE INDEX "student_classId_idx" ON "student"("classId");

-- CreateIndex
CREATE INDEX "student_registrationId_idx" ON "student"("registrationId");

-- CreateIndex
CREATE INDEX "studentClassHistory_studentId_idx" ON "studentClassHistory"("studentId");

-- CreateIndex
CREATE INDEX "studentClassHistory_year_idx" ON "studentClassHistory"("year");

-- CreateIndex
CREATE UNIQUE INDEX "subject_name_key" ON "subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_userId_key" ON "teacher"("userId");

-- CreateIndex
CREATE INDEX "teacherSubject_teacherId_idx" ON "teacherSubject"("teacherId");

-- CreateIndex
CREATE INDEX "teacherSubject_subjectId_idx" ON "teacherSubject"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "teacherSubject_teacherId_subjectId_key" ON "teacherSubject"("teacherId", "subjectId");

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_programId_fkey" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classSubject" ADD CONSTRAINT "classSubject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classSubject" ADD CONSTRAINT "classSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentRequest" ADD CONSTRAINT "documentRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentRequest" ADD CONSTRAINT "documentRequest_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formFillup" ADD CONSTRAINT "formFillup_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formFillup" ADD CONSTRAINT "formFillup_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formFillup" ADD CONSTRAINT "formFillup_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice" ADD CONSTRAINT "notice_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noticeClass" ADD CONSTRAINT "noticeClass_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "notice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noticeClass" ADD CONSTRAINT "noticeClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_formFillupId_fkey" FOREIGN KEY ("formFillupId") REFERENCES "formFillup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine" ADD CONSTRAINT "routine_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine" ADD CONSTRAINT "routine_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine" ADD CONSTRAINT "routine_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine" ADD CONSTRAINT "routine_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "timeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentClassHistory" ADD CONSTRAINT "studentClassHistory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentClassHistory" ADD CONSTRAINT "studentClassHistory_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacherSubject" ADD CONSTRAINT "teacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacherSubject" ADD CONSTRAINT "teacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
