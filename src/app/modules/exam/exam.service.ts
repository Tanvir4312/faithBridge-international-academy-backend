import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IExamCreatePayload, IExamUpdatePayload } from "./exam.interface";

const createExam = async (payload: IExamCreatePayload) => {
  const nowDate = new Date();
  if (payload.formFillupEnd < nowDate) {
    throw new AppError(status.BAD_REQUEST, "Form fillup end date is in the past");
  }
  if (payload.formFillupStart < nowDate) {
    throw new AppError(status.BAD_REQUEST, "Form fillup start date is in the past");
  }
  if (payload.examDate && payload.examDate < nowDate) {
    throw new AppError(status.BAD_REQUEST, "Exam date is in the past");
  }
  const isExamExist = await prisma.exam.findUnique({
    where: {
      name_year: {
        name: payload.name,
        year: payload.year,
      },
    },
  });

  if (isExamExist) {
    throw new AppError(status.BAD_REQUEST, "Exam already exist");
  }
  const result = await prisma.exam.create({ data: payload });
  return result;
};

const getAllExam = async () => {
  const result = await prisma.exam.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      formFillups: {
        include: {
          student: {
            select: {
              nameEn: true,
              results: true,
            },
          },
        },
      },

    },
    orderBy: {
      year: "desc",
    },
  });
  return result;
};

const updateExam = async (payload: IExamUpdatePayload, id: string) => {
  const isExamExist = await prisma.exam.findUnique({
    where: {
      id,
    },
  });

  if (!isExamExist) {
    throw new AppError(status.BAD_REQUEST, "Exam not found");
  }
  const result = await prisma.exam.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteExam = async (id: string) => {
  const nowDate = new Date();
  const isExamExist = await prisma.exam.findUnique({
    where: {
      id,
    },
  });

  if (!isExamExist) {
    throw new AppError(status.BAD_REQUEST, "Exam not found");
  }

  if (isExamExist.formFillupEnd > nowDate) {
    throw new AppError(status.BAD_REQUEST, "this exam is not deleted because form fillup end date is in the future");
  }

  if (isExamExist.examDate && isExamExist.examDate > nowDate) {
    throw new AppError(status.BAD_REQUEST, "this exam is not deleted because exam date is in the future");
  }
  const result = await prisma.exam.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const ExamService = { createExam, getAllExam, updateExam, deleteExam };
