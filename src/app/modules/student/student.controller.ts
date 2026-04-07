import status from "http-status";
import { catchAsync } from "../../shared/cathAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StudentService } from "./student.service";
import { Request, Response } from "express";

const getAllStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.getAllStudent();
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Student fetched successfully",
    success: true,
    data: result,
  });
});

const getStudentById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const result = await StudentService.getStudentById(id as string, user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Student fetched successfully",
    success: true,
    data: result,
  });
});

const studentDelete = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await StudentService.studentDelete(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Student deleted successfully",
    success: true,
    data: result,
  });
});

const studentUpdate = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = {
    ...req.body,
    profileImage : req.file?.path
  };

  const user = req.user;
  const result = await StudentService.studentUpdate(id as string, payload, user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Student updated successfully",
    success: true,
    data: result,
  });
});

export const StudentController = {
  getAllStudent,
  getStudentById,
  studentDelete,
  studentUpdate,
};
