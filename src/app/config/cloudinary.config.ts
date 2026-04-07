import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import status from "http-status";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});
export const cloudinaryUpload = cloudinary;

export const uploadFileToCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  if (!buffer || !fileName) {
    throw new AppError(status.BAD_REQUEST, "File not found");
  }

  const extension = fileName.split(".").pop()?.toLocaleLowerCase();
  const fileNameWithoutExtension = fileName
    .split(".")
    .slice(0, 1)
    .join(".")
    .toLowerCase()
    .replace(/\s+/g, "-")
    // eslint-disable-next-line no-useless-escape
    .replace(/[^a-z0-9\-]/g, "");

  const uniqueName =
    Math.random().toString(36).substring(2) +
    "_" +
    Date.now() +
    "_" +
    fileNameWithoutExtension;
  const folder = extension === "pdf" ? "pdfs" : "images";
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          public_id: `school-management/${folder}/${uniqueName}`,
          folder: `school-management/${folder}`,
        },
        (error, result) => {
          if (error) {
            return reject(
              new AppError(
                status.BAD_REQUEST,
                "Failed to upload file to cloudinary",
              ),
            );
          }
          resolve(result as UploadApiResponse);
        },
      )
      .end(buffer);
  });
};

export const deleteFileFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-z0-9]+)+$/;

    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (err) {
    console.log(err);
    throw new AppError(
      status.BAD_REQUEST,
      "Faile to delete file from cloudinary",
    );
  }
};
