import { Prisma } from "../../../generated/prisma/client";

export const formFillupSearchableFields = [
  'registrationNo',
  'classRoll',
  'student.id',
  'class.id',
  'exam.id'
];

export const formFillupFilterableFields = [
  'studentId',
  'classId',
  'examId',
  'status',
  'paymentStatus',
   'student.id',
  'class.id',
  'exam.id'
];

export const fromFillupIncludeConfig : Partial<Record<keyof Prisma.FormFillupInclude, Prisma.FormFillupInclude[keyof Prisma.FormFillupInclude]>> ={
  student: true,
  class: true,
  exam: true
  
}