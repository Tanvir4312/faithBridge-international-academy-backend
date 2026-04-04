import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ITeacherUpadatePayload } from "./teacher.interface";

const getAllTeacher = async () => {
  const teacher = await prisma.teacher.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
      teacherSubjects: {
        include: {
          subject: true,
        },
      },
    },
  });
  return teacher;
};

const getTeacherById = async (id: string) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
    include: {
      user: true,

      teacherSubjects: {
        include: {
          subject: true,
        },
      },
    },
  });
  return teacher;
};

const teacherUpdate = async (id: string, payload: ITeacherUpadatePayload) => {
  const isTeacherExis = await prisma.teacher.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isTeacherExis) {
    throw new AppError(status.NOT_FOUND, "Teacher not found");
  }

  const { teacher: teacherData, subjects } = payload;


  await prisma.$transaction(async (tx) => {
    if (teacherData) {
      await tx.teacher.update({
        where: {
          id,
        },
        data: {
          ...teacherData,
        },
      });
    }
    if (teacherData?.name) {
      await tx.user.update({
        where: {
          id: isTeacherExis.userId,
        },
        data: {
          name: teacherData?.name,
        },
      });
    }

    if (subjects && subjects.length > 0) {
      for (const subject of subjects) {
        const { subjectId, isDeleted } = subject;

        if (isDeleted) {
          await tx.teacherSubject.delete({
            where: {
              teacherId_subjectId: {
                teacherId: id,
                subjectId,
              },
            },
          });
        } else {
          await tx.teacherSubject.upsert({
            where: {
              teacherId_subjectId: {
                teacherId: id,
                subjectId,
              },
            },
            create: {
              teacherId: id,
              subjectId,
            },
            update: {},
          });
        }
      }
    }
  });
  const teacher = await getTeacherById(id);
  return teacher;
};

const teacherDelete = async (id: string) => {
  const isExisTeacher = await prisma.teacher.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!isExisTeacher) {
    throw new AppError(status.NOT_FOUND, "Teacher not found");
  }
  return await prisma.$transaction(async (tx) => {
    await tx.teacher.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    await tx.user.update({
      where: {
        id: isExisTeacher.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    await tx.session.deleteMany({
      where: {
        userId: isExisTeacher.userId,
      },
    });
  });
};

export const TeacherService = {
  getAllTeacher,
  getTeacherById,
  teacherUpdate,
  teacherDelete,
};
