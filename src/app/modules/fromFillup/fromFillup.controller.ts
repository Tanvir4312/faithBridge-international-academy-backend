import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { FromFillupService } from "./fromFillup.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createFromFillup = catchAsync(async (req: Request, res: Response) => {
    const result = await FromFillupService.createFromFillup(req.body);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        message: "FromFillup created successfully",
        success: true,
        data: result,
    });
});

const getAllFromFillup = catchAsync(async (req: Request, res: Response) => {
    const result = await FromFillupService.getAllFromFillup();
    sendResponse(res, {
        httpStatusCode: status.OK,
        message: "FromFillup fetched successfully",
        success: true,
        data: result,
    });
});

const updateFromFillUpStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await FromFillupService.updateFromFillUpStatus(payload, id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        message: "FromFillup updated successfully",
        success: true,
        data: result,
    });
});

const deleteFromFillup = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FromFillupService.deleteFromFillup(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        message: "FromFillup deleted successfully",
        success: true,
        data: result,
    });
});

export const FromFillupController = {
    createFromFillup,
    updateFromFillUpStatus,
    getAllFromFillup,
    deleteFromFillup,
};