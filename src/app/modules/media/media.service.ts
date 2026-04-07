import { prisma } from "../../lib/prisma";
import { ICreateMediaPayload, IMediaFiles } from "./media.interface";

const createMedia = async (payload: ICreateMediaPayload) => {
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

export const MediaService = { createMedia };
