import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { MediaService } from "./media.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createMedia = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaService.createMedia(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    message: "Media created successfully",
    success: true,
    data: result,
  });
});

const getAllMedia = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaService.getAllMedia();
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Media fetched successfully",
    success: true,
    data: result,
  });
});

const deleteMedia = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await MediaService.deleteMedia(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Media deleted successfully",
    success: true,
    data: result,
  });
});

export const MediaController = {
  createMedia,
  getAllMedia,
  deleteMedia,
};
