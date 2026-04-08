import { Prisma } from "../../../generated/prisma/client";

export const studentSearchableFields = [
  "registrationId",

  "nameBn",
  "nameEn",
  "fatherName",
  "motherName",
  "guardianMobile",
  "studentMobile",
  "presentAddress",
  "permanentAddress",
  "birthCertificateNo",
  "user.id",
  "application.id",
  "class.id",
];

export const studentFilterableFields = [
  "classId",
  "gender",
  "religion",
  "bloodGroup",
  "isDeleted",

  "classRoll",
];

export const studentIncludeConfig: Partial<
  Record<
    keyof Prisma.StudentInclude,
    Prisma.StudentInclude[keyof Prisma.StudentInclude]
  >
> = {
  user: true,
  application: true,
  class: true,
};
