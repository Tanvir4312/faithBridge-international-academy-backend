import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { SubjectService } from "./subject.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createSubject = catchAsync(async (req: Request, res: Response) => {
  const result = await SubjectService.createSubject(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    message: "Subject created successfully",
    success: true,
    data: result,
  });
});

const getAllSubject = catchAsync(async (req: Request, res: Response) => {
  const result = await SubjectService.getAllSubject();
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Subject fetched successfully",
    success: true,
    data: result,
  });
});

const subjectUpdate = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await SubjectService.subjectUpdate(id as string, payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Subject updated successfully",
    success: true,
    data: result,
  });
});

const subjectDelete = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await SubjectService.subjectDelete(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Subject deleted successfully",
    success: true,
    data: result,
  });
});

export const SubjectController = {
  createSubject,
  getAllSubject,
  subjectUpdate,
  subjectDelete,
};
