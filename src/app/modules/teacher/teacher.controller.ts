import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { TeacherService } from "./teacher.service";
import pick from "../../shared/pick";
import { teacherFilterableFields } from "./teacher.constant";
import { getPaginationOptions } from "../../helper/paginationHelper";

const getAllTeacher = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, teacherFilterableFields);
  const { page, limit, skip } = getPaginationOptions(req.query);
  const sortBy = req.query.sortBy as string;
  const sortOrder = req.query.sortOrder as string;

  const result = await TeacherService.getAllTeacher(
    filters,
    { page, limit, skip, sortBy, sortOrder }
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Teacher fetched successfully",
    success: true,
    data: result,
  });
});
const getAllTeacherwithoutQuery = catchAsync(async (req: Request, res: Response) => {
  const result = await TeacherService.getAllTeacherwithoutQuery();
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Teacher fetched successfully",
    success: true,
    data: result,
  });
});

const getTeacherById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TeacherService.getTeacherById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Teacher fetched successfully",
    success: true,
    data: result,
  });
});

const teacherUpdate = catchAsync(async (req: Request, res: Response) => {

  const id = req.params.id;

  const payload = {
    ...req.body,
    profilePhoto: req.file?.path,
  };
  const user = req.user;

  const result = await TeacherService.teacherUpdate(
    id as string,
    payload,
    user,

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
  getAllTeacherwithoutQuery,
  getTeacherById,
  teacherUpdate,
  teacherDelete,
};
