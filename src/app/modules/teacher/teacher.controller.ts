import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { TeacherService } from "./teacher.service";

const getAllTeacher = catchAsync(async (req: Request, res: Response) => {
  const result = await TeacherService.getAllTeacher();
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Teacher fetched successfully",
    success: true,
    data: result,
  });
});

const getTeacherById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const result = await TeacherService.getTeacherById(id as string, user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Teacher fetched successfully",
    success: true,
    data: result,
  });
});

const teacherUpdate = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const profilePhoto = req.file?.path;
  const user = req.user;

  const result = await TeacherService.teacherUpdate(
    id as string,
    payload,
    user,
    profilePhoto as string,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Teacher updated successfully",
    success: true,
    data: result,
  });
});

const teacherDelete = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TeacherService.teacherDelete(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Teacher deleted successfully",
    success: true,
    data: result,
  });
});

export const TeacherController = {
  getAllTeacher,
  getTeacherById,
  teacherUpdate,
  teacherDelete,
};
