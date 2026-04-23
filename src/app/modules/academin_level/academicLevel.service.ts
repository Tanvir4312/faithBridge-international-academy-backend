import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  ICreateAcademicLevel,
  ICUpdateAcademicLevel,
} from "./academicLevel.interface";

const createAcademicLevel = async (payload: ICreateAcademicLevel) => {
  const result = await prisma.academicLevel.create({ data: payload });
  return result;
};

const getAllAcademicLevel = async () => {
  const result = await prisma.academicLevel.findMany({
    include: {
      classes: true,
    },
  });
  return result;
};

const getAcademicLevelById = async (id: string) => {
  const isAcademicLevelExist = await prisma.academicLevel.findUnique({
    where: {
      id,
    },

  });

  if (!isAcademicLevelExist) {
    throw new AppError(status.NOT_FOUND, "Academic level not found");
  }
  const result = await prisma.academicLevel.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAcademicLevel = async (
  id: string,
  payload: ICUpdateAcademicLevel,
) => {
  const isAcademicLevelExist = await prisma.academicLevel.findUnique({
    where: {
      id,
    },
  });

  if (!isAcademicLevelExist) {
    throw new AppError(status.NOT_FOUND, "Academic level not found");
  }
  const result = await prisma.academicLevel.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteAcademicLevel = async (id: string) => {
  const isAcademicLevelExist = await prisma.academicLevel.findUnique({
    where: {
      id,
    },
  });

  if (!isAcademicLevelExist) {
    throw new AppError(status.NOT_FOUND, "Academic level not found");
  }
  const result = await prisma.academicLevel.delete({
    where: {
      id,
    },
  });
  return result;
};

export const AcademicLevelService = {
  createAcademicLevel,
  getAllAcademicLevel,
  getAcademicLevelById,
  updateAcademicLevel,
  deleteAcademicLevel,
};
