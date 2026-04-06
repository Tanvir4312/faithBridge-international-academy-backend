import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import status from "http-status";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});
export const cloudinaryUpload = cloudinary;

export const deleteFileFromCloudinary = async (url: string) => {
  try{
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-z0-9]+)+$/;

  const match = url.match(regex);
  if (match && match[1]) {
    const publicId = match[1];
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    console.log(`File ${publicId} deleted from cloudinary`);
  }
  }catch (err) {
    console.log(err);
    throw new AppError(
      status.BAD_REQUEST,
      "Faile to delete file from cloudinary",
    );
  }
};
