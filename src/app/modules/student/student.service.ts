import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interfaces/requestUser.inteface";
import { IUpdateStudentPayload } from "./student.interface";

const getAllStudent = async () => {
  const result = await prisma.student.findMany({
    include: {
      user: true,
      class: {
        select: {
          name: true,
          id: true,
          AcademicLevel: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const getStudentById = async (id: string, user: IRequestUser) => {
  const isExisStudent = await prisma.student.findUnique({
    where: {
      id,
    },
  });
  console.log(user);

  if (!isExisStudent) {
    throw new AppError(status.NOT_FOUND, "Student not found");
  }

  if (user.role === "STUDENT") {
    if (user.userId !== isExisStudent.userId) {
      throw new AppError(
        status.UNAUTHORIZED,
        "You are not authorized to access this student",
      );
    }
  }

  const result = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      class: {
        select: {
          name: true,
          AcademicLevel: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const studentDelete = async (id: string) => {
  const isStudentExist = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      classHistories: {
        select: {
          class: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
  if (!isStudentExist) {
    throw new AppError(status.NOT_FOUND, "Student not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.student.update({
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
        id: isStudentExist.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    const studentClassHistory = await tx.studentClassHistory.findMany({
      where: {
        studentId: id,
      },
    });

    for (const history of studentClassHistory) {
      await tx.studentClassHistory.update({
        where: {
          id: history.id,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    }

    await tx.session.deleteMany({
      where: {
        userId: isStudentExist.userId,
      },
    });
    await tx.account.deleteMany({
      where: {
        userId: isStudentExist.userId,
      },
    });
    const student = await tx.student.findUnique({
      where: {
        id,
      },
    });
    return student;
  });

  return result;
};

const studentUpdate = async (
  id: string,
  payload: IUpdateStudentPayload,
  user: IRequestUser,
) => {
  console.log(id)
  const isStudentExist = await prisma.student.findUnique({
    where: {
      id,
    },
  });

  if (!isStudentExist) {
    throw new AppError(status.NOT_FOUND, "Student not found");
  }

  if (user.role === "STUDENT") {
    if (user.userId !== isStudentExist.userId) {
      throw new AppError(
        status.UNAUTHORIZED,
        "You are not authorized to access this student",
      );
    }
  }

  return await prisma.$transaction(async (tx) => {
  const result =  await tx.student.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
    });
    await tx.user.update({
      where: {
        id: isStudentExist.userId,
      },
      data: {
        name: payload.nameEn,
        image : payload.profileImage
      },
    });
    return result;
  });
};

export const StudentService = {
  getAllStudent,
  getStudentById,
  studentDelete,
  studentUpdate,
};
