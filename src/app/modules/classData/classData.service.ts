import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateClass } from "./class.interface";
const createClassData = async (payload: ICreateClass) => {
  const classess = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];
  const calssName = classess.includes(payload.name);
  if (!calssName) {
    throw new AppError(status.BAD_REQUEST, "Invalid class name");
  }
  const createClass = await prisma.class.create({
    data: {
      name: payload.name,
      AcademicLevelId: payload.academicLevelId,
    },
  });
  return createClass;
};

const getAllClassData = async () => {
  const result = await prisma.class.findMany({
    include: {
      classTeacher : {
        include : {
          teacher : true
        }
      },
      students: true,
      notices: true,
      studentHistories: true,
      AcademicLevel: true,
    },
  });
  return result;
};

export const classDataService = {
  createClassData,
  getAllClassData,
};
