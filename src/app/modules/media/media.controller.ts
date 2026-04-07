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

export const MediaController = {
    createMedia,
};