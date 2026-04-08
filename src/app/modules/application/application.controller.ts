import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";

import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { ApplicationService } from "./application.services";


const createApplication = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    profileImage: req.file?.path,
  };
  const user = req.user;
  const result = await ApplicationService.createApplication(payload, user);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    message: "Application created successfully",
    success: true,
    data: result,
  });
});

const getAllApplication = catchAsync(async (req: Request, res: Response) => {

  const result = await ApplicationService.getAllApplication();
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Application fetched successfully",
    success: true,
    data: result,
  });
});

const getApplicationById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ApplicationService.getApplicationById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Application fetched successfully",
    success: true,
    data: result,
  });
});

const getOwnApplication = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const result = await ApplicationService.getOwnApplication(id as string, user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Application fetched successfully",
    success: true,
    data: result,
  });
});

const applicationSoftDelete = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ApplicationService.applicationSoftDelete(id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      message: "Application deleted successfully",
      success: true,
      data: result,
    });
  },
);

const applicationUpdateByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ApplicationService.applicationUpdateByAdmin(
      id as string,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      message: "Application updated successfully",
      success: true,
      data: result,
    });
  },
);

const applicationRejectByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ApplicationService.applicationRejectByAdmin(
      id as string,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      message: "Application rejected successfully",
      success: true,
      data: result,
    });
  },
);

export const ApplicationController = {
  createApplication,
  getAllApplication,
  getApplicationById,
  getOwnApplication,
  applicationSoftDelete,
  applicationUpdateByAdmin,
  applicationRejectByAdmin,
};
