import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.inteface";
import { prisma } from "../../lib/prisma";
import { ICreateNoticesPayload } from "./notice.interface";

const createNotices = async (
  payload: ICreateNoticesPayload,
  user: IRequestUser,
) => {
  return await prisma.$transaction(async (tx) => {
    if (payload.type === "GENERAL" && payload.noticeClasses && payload.noticeClasses.length > 0) {
      throw new AppError(
        status.BAD_REQUEST,
        "GENERAL notice is not required to have notice classes",
      );
    }

    if (payload.type === "CLASS_SPECIFIC" && (!payload.noticeClasses || payload.noticeClasses.length === 0)) {
      throw new AppError(
        status.BAD_REQUEST,
        "CLASS_SPECIFIC notice is required to have notice classes",
      );
    }

    const classIds: string[] = [];

    for (const classId of (payload?.noticeClasses || [])) {
      classIds.push(classId);
    }
    const notice = await tx.notice.create({
      data: {
        title: payload.title,
        details: payload.details,
        type: payload.type,
        authorId: user.userId,
      },
    });

    if (payload.type === "CLASS_SPECIFIC" && payload.noticeClasses) {
      await tx.noticeClass.createMany({
        data: classIds.map((classId) => {
          return {
            noticeId: notice.id,
            classId,
          };
        }),
      });
    }

    const result = await tx.notice.findUnique({
      where: {
        id: notice.id,
      },
      include: {
        noticeClasses: {
          select: {
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return result;
  });
};

const getAllNotice = async () => {
  return await prisma.notice.findMany({
    include: {
      noticeClasses: {
        select: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

export const getNoticeById = async (id: string) => {
  const result = await prisma.notice.findUnique({
    where: {
      id,
    },
    include: {
      noticeClasses: {
        select: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const deleteNotice = async (id: string) => {
  const isExistNotice = await prisma.notice.findUnique({
    where: {
      id,
    },
  });
  if (!isExistNotice) {
    throw new AppError(status.NOT_FOUND, "Notice not found");
  }
  return await prisma.$transaction(async (tx) => {
    await tx.noticeClass.deleteMany({
      where: {
        noticeId: isExistNotice.id,
      },
    });
    await tx.notice.delete({
      where: {
        id,
      },
    });
  });
};

export const NoticeService = {
  createNotices,
  getAllNotice,
  getNoticeById,
  deleteNotice,
};
