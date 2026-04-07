import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IExamCreatePayload } from "./exam.interface";

const createExam = async (payload: IExamCreatePayload) => {
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
  const result = await prisma.exam.findMany();
  return result;
};

export const ExamService = { createExam, getAllExam };
