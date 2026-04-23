import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { AcademicLevelService } from "./academicLevel.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createAcademicLevel = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    image: req.file?.path,
  };
  const result = await AcademicLevelService.createAcademicLevel(payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    message: "Academic level created successfully",
    success: true,
    data: result,
  });
});

const getAllAcademicLevel = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicLevelService.getAllAcademicLevel();
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Academic level fetched successfully",
    success: true,
    data: result,
  });
});

const getAcademicLevelById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AcademicLevelService.getAcademicLevelById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Academic level fetched successfully",
    success: true,
    data: result,
  });
});

const updateAcademicLevel = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = {
    ...req.body,
    image: req.file?.path,
  };
  const result = await AcademicLevelService.updateAcademicLevel(
    id as string,
    payload,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Academic level updated successfully",
    success: true,
    data: result,
  });
});

const deleteAcademicLevel = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AcademicLevelService.deleteAcademicLevel(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Academic level deleted successfully",
    success: true,
    data: result,
  });
});

export const AcademicLevelController = {
  createAcademicLevel,
  getAllAcademicLevel,
  updateAcademicLevel,
  deleteAcademicLevel,
  getAcademicLevelById,
};
