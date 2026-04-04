import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateTeacherPayload } from "./user.interface";
import { auth } from "../../lib/auth";
import { Role } from "../../../generated/prisma/enums";

const createTeacher = async (payload: ICreateTeacherPayload) => {
  const isExitUser = await prisma.user.findUnique({
    where: {
      email: payload.teacher.email,
    },
  });

  if (isExitUser) {
    throw new AppError(status.BAD_REQUEST, "User already exist");
  }

  const userdata = await auth.api.signUpEmail({
    body: {
      name: payload.teacher.name,
      email: payload.teacher.email,
      password: payload.password,
      role: Role.TEACHER,
      needPasswordChange: true,
    },
  });

  const teacher = await prisma.teacher.create({
    data: {
      userId: userdata.user.id,
      ...payload.teacher,
    },
    include : {
      user : true
    }
  });

  return teacher;
};

export const UserService = {
  createTeacher,
};
