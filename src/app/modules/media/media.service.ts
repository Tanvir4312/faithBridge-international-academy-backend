import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateMediaPayload, IMediaFiles } from "./media.interface";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";

const createMedia = async (payload: ICreateMediaPayload) => {
    throw new Error("Function not implemented.");
  const { sectionName, description, mediaFiles } = payload;
  const result = await prisma.$transaction(async (tx) => {
    await tx.media.createMany({
      data: mediaFiles.map((file: IMediaFiles) => {
        return {
          key: file.key,
          url: file.url,
          sectionName,
          description: description || null,
        };
      }),
    });
    const media = await tx.media.findMany();
    return media;
  });
  return result;
};

const getAllMedia = async () => {
  const result = await prisma.media.findMany();
  return result;
};

const deleteMedia = async (id: string) => {
  const isMediaExist = await prisma.media.findUnique({
    where: {
      id,
    },
  });

  if (!isMediaExist) {
    throw new AppError(status.NOT_FOUND, "Media not found");
  }

  return await prisma.$transaction(async (tx) => {
    const result = await tx.media.update({
      where: {
        id,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    if (result.isDeleted) {
      await tx.media.delete({
        where: {
          id,
          isDeleted: true,
        },
      });
    }

    if (result.isDeleted) {
      await deleteFileFromCloudinary(result.url);
    }
  });
};

export const MediaService = {
  createMedia,
  getAllMedia,
  deleteMedia,
};
