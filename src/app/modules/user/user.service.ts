import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateTeacherPayload } from "./user.interface";
import { auth } from "../../lib/auth";
import { Role } from "../../../generated/prisma/enums";
import { Subject } from "../../../generated/prisma/client";

const createTeacher = async (payload: ICreateTeacherPayload) => {
  const subjects: Subject[] = [];
  for (const subjectId of payload.subjects) {
    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },
    });
    if (!subject) {
      throw new AppError(status.NOT_FOUND, "Subject not found");
    }
    subjects.push(subject);
  }

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

  try {
    const result = await prisma.$transaction(async (tx) => {
      const teacherData = await tx.teacher.create({
        data: {
          userId: userdata.user.id,
          ...payload.teacher,
        },
      });

      const teacherSubjects = subjects.map((subject) => {
        return {
          teacherId: teacherData.id,
          subjectId: subject.id,
        };
      });

      await tx.teacherSubject.createMany({
        data: teacherSubjects,
      });

      const teacher = await tx.teacher.findUnique({
        where: {
          id: teacherData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          contactNumber: true,
          address: true,
          qualification: true,
          gender: true,
          profilePhoto: true,
          isDeleted: true,
          designation: true,
          createdat: true,
          updatedAt: true,
          deletedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              emailVerified: true,
              needPasswordChange: true,
              isDeleted: true,
              deletedAt: true,
            },
          },
          teacherSubjects: {
            select: {
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      return teacher;
    });

    return result;
  } catch (err) {
    await prisma.user.delete({
      where: {
        id: userdata.user.id,
      },
    });
    console.log(err);
  }
};
export const UserService = {
  createTeacher,
};
