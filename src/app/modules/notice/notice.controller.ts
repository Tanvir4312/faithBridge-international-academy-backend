import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { NoticeService } from "./notice.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createNotices = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await NoticeService.createNotices(req.body, user);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    message: "Notice created successfully",
    success: true,
    data: result,
  });
});


  const getAllNotice = catchAsync(async (req: Request, res: Response) => {
    const result = await NoticeService.getAllNotice();
    sendResponse(res, {
      httpStatusCode: status.OK,
      message: "Notice fetched successfully",
      success: true,
      data: result,
    });
  });

  const getNoticeById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await NoticeService.getNoticeById(id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      message: "Notice fetched successfully",
      success: true,
      data: result,
    });
  });

  const deleteNotice = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await NoticeService.deleteNotice(id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      message: "Notice deleted successfully",
      success: true,
      data: result,
    });
  });

export const NoticeController = {
  createNotices,
  getAllNotice,
  getNoticeById,
  deleteNotice,
};
