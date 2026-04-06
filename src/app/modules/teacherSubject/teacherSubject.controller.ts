import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { sendResponse } from "../../shared/sendResponse";
import { TeacherSubjectService } from "./teacherSubject.service";
import status from "http-status";

const assignSubjectToTeacher = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await TeacherSubjectService.assignSubjectToTeacher(payload);
    sendResponse(res, {
      httpStatusCode: status.OK,
      message: "Subject assigned to teacher successfully",
      success: true,
      data: result,
    });
  },
);

const teacherPrimarySubjectUpdate = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result =
      await TeacherSubjectService.teacherPrimarySubjectUpdate(payload);
    sendResponse(res, {
      httpStatusCode: status.OK,
      message: "Subject assigned to teacher successfully",
      success: true,
      data: result,
    });
  },
);

const teacherSubjectDelete = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await TeacherSubjectService.teacherSubjectDelete(payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Subject deleted from teacher successfully",
    success: true,
    data: result,
  });
});

export const TeacherSubjectController = {
  assignSubjectToTeacher,
  teacherPrimarySubjectUpdate,
  teacherSubjectDelete
};
