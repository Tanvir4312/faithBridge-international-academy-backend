import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ITeacherUpadatePayload } from "./teacher.interface";
import { IRequestUser } from "../../interfaces/requestUser.inteface";

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

const getTeacherById = async (id: string, user: IRequestUser) => {
  const isExisTeacher = await prisma.teacher.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });
  if (!isExisTeacher) {
    throw new AppError(status.NOT_FOUND, "Teacher not found");
  }

  if (user.role === "TEACHER") {
    if (user.userId !== isExisTeacher.userId) {
      throw new AppError(
        status.UNAUTHORIZED,
        "You are not authorized to access this teacher",
      );
    }
  }

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

const teacherUpdate = async (
  id: string,
  payload: ITeacherUpadatePayload,
  user: IRequestUser,
) => {
  const isTeacherExis = await prisma.teacher.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });

  if (!isTeacherExis) {
    throw new AppError(status.NOT_FOUND, "Teacher not found");
  }

  if (user.role === "TEACHER") {
    if (user.email !== isTeacherExis.user.email) {
      throw new AppError(
        status.UNAUTHORIZED,
        "You are not authorized to update this teacher",
      );
    }
  }

  const { teacher: teacherData } = payload;

  return await prisma.$transaction(async (tx) => {
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

    const teacher = await tx.teacher.findUnique({
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
  });
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
    await tx.teacherSubject.updateMany({
      where: {
        teacherId: id,
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
