import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ITeacherUpadatePayload, ITeacherFilterRequest } from "./teacher.interface";
import { IRequestUser } from "../../interfaces/requestUser.inteface";
import { UserStatus } from "../../../generated/prisma/enums";
import { TeacherWhereInput } from "../../../generated/prisma/models";
import { teacherSearchableFields } from "./teacher.constant";

const getAllTeacher = async (
  filters: ITeacherFilterRequest,
  options: {
    page: number;
    limit: number;
    skip: number;
    sortBy?: string;
    sortOrder?: string;
  }
) => {
  const { searchTerm, subject, isPrimary, class: className, ...filterData } = filters;
  const { limit, skip, page } = options;
  const sortBy = options.sortBy || "createdat";
  const sortOrder = options.sortOrder || "desc";

  const andCondition: TeacherWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: teacherSearchableFields.map((field) => {
        if (field === "name" || field === "email") {
          return {
            user: {
              [field]: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          };
        }
        return {
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  if (subject || isPrimary) {
    const subjectCondition: any = {};
    if (subject) {
      subjectCondition.subject = {
        name: {
          contains: subject,
          mode: "insensitive",
        },
      };
    }
    if (isPrimary !== undefined) {
      subjectCondition.isPrimary = isPrimary === "true";
    }

    andCondition.push({
      teacherSubjects: {
        some: subjectCondition,
      },
    });
  }

  if (className) {
    andCondition.push({
      classTeacher: {
        class: {
          name: {
            contains: className,
            mode: "insensitive",
          },
        },
      },
    });
  }

  const whereConditions: TeacherWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const teacher = await prisma.teacher.findMany({
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
    where: {
      ...whereConditions,
      isDeleted: false,
    },
    include: {
      user: true,
      teacherSubjects: {
        select: {
          isPrimary: true,
          subject: {
            select: {
              name: true,
            },
          },
        },
      },
      classTeacher: {
        select: {
          class: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const totalTeacher = await prisma.teacher.count({
    where: {
      ...whereConditions,
      isDeleted: false,
    },
  });

  return {
    data: teacher,
    meta: {
      limit,
      current_Page: page,
      total_page: Math.ceil(totalTeacher / limit),
      total: totalTeacher,
    },
  };
};
const getAllTeacherwithoutQuery = async () => {
  const teacher = await prisma.teacher.findMany({
    include: {
      user: true,
      teacherSubjects: {
        select: {
          isPrimary: true,
          subject: {
            select: {
              name: true,
            },
          },
        },
      },
      classTeacher: {
        select: {
          class: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });



  return {
    data: teacher,

  };
};

const getTeacherById = async (id: string) => {
  const isExisTeacher = await prisma.teacher.findUnique({
    where: {
      id,
      isDeleted: false,
    }
  });
  if (!isExisTeacher) {
    throw new AppError(status.NOT_FOUND, "Teacher not found");
  }


  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
    include: {
      user: true,

      teacherSubjects: {
        select: {
          subjectId: true,
          isPrimary: true,
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
  getAllTeacherwithoutQuery,
  getTeacherById,
  teacherUpdate,
  teacherDelete,
};
