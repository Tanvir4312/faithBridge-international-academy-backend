import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ITeacherUpadatePayload } from "./teacher.interface";
import { IRequestUser } from "../../interfaces/requestUser.inteface";
import { UserStatus } from "../../../generated/prisma/enums";

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
    }
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
        select: {
          subject: {
            select: {
              name: true,
            }
          }
        }
      },
      classTeacher: {
        select: {
          class: {
            select: {
              name: true,
              notices: {
                select: {
                  notice: {
                    select: {
                      title: true,
                      type: true,
                      details: true,
                      createdAt: true,
                      updatedAt: true,
                    }
                  }
                }
              },
              students: true
            }
          },

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



  return await prisma.$transaction(async (tx) => {
    if (payload) {
      await tx.teacher.update({
        where: {
          id,
        },
        data: {
          ...payload
        }
      });
    }
    if (payload?.name) {
      await tx.user.update({
        where: {
          id: isTeacherExis.userId,
        },
        data: {
          name: payload?.name,
        },
      });
    }
    if (payload?.email) {
      await tx.user.update({
        where: {
          id: isTeacherExis.userId,
        },
        data: {
          email: payload?.email,
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
        status: UserStatus.INACTIVE,

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
