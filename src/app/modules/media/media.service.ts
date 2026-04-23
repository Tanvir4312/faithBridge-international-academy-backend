import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateMediaPayload, IMediaFiles } from "./media.interface";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";

const createMedia = async (payload: ICreateMediaPayload) => {
  const { sectionName, description, mediaFiles } = payload;

  if (!mediaFiles || mediaFiles.length === 0) {
    throw new Error("No files uploaded");
  }

  const result = await prisma.$transaction(async (tx) => {

    const existingMedia = await tx.media.findMany({
      where: {
        key: {
          in: mediaFiles.map((file: IMediaFiles) => file.key),
        },
      },
    });

    if (existingMedia.length > 0) {
      throw new AppError(status.BAD_REQUEST, "Media already exists");
    }

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
    const result = await tx.media.delete({
      where: {
        id,
        isDeleted: false,
      },
    });



    if (result) {
      await deleteFileFromCloudinary(result.url);
    }
  });
};

export const MediaService = {
  createMedia,
  getAllMedia,
  deleteMedia,
};
