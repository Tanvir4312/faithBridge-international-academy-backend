import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { UserService } from "./user.service";

const createTeacher = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createTeacher(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    message: "Teacher created successfully",
    success: true,
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmins(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    message: "Admin created successfully",
    success: true,
    data: result,
  });
});

export const UserController = {
  createTeacher,
  createAdmin,
};
