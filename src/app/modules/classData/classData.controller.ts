import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { classDataService } from "./classData.service";

const createClassData = catchAsync(async (req: Request, res: Response) => {
  const result = await classDataService.createClassData(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    message: "ClassData created successfully",
    success: true,
    data: result,
  });
});

const getallClaasData = catchAsync(async (req: Request, res: Response) => {
  const result = await classDataService.getAllClassData();
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "ClassData fetched successfully",
    success: true,
    data: result,
  });
});

export const ClassDataController = {
  createClassData,
  getallClaasData,
};
