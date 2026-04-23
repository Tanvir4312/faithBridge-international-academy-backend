import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { UserService } from "./user.service";
import { getPaginationOptions } from "../../helper/paginationHelper";

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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { searchTerm } = req.query
  const { page, limit, skip } = getPaginationOptions(req.query)
  const sortBy = req.query.sortBy || 'createdAt'
  const sortOrder = req.query.sortOrder || 'desc'
  const result = await UserService.getAllUsers(searchTerm as string,
    page,
    limit,
    skip,
    sortBy as string,
    sortOrder as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Users fetched successfully",
    success: true,
    data: result,
  });
});

export const UserController = {
  createTeacher,
  createAdmin,
  getAllUsers,
};
