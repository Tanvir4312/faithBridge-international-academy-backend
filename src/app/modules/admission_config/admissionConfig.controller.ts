import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { admissionConfigService } from "./admissionConfig.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";


export const createAdmissionConfig = catchAsync(async (req: Request, res: Response) => {
    const result = await admissionConfigService.createAdmissionConfig(req.body)
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admission config created successfully",
        data: result
    })
})

export const getAllAdmissionConfig = catchAsync(async (req: Request, res: Response) => {
    const result = await admissionConfigService.getAllAdmissionConfig()
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admission config fetched successfully",
        data: result
    })
})

export const updateAdmissionConfig = catchAsync(async (req: Request, res: Response) => {
    const result = await admissionConfigService.updateAdmissionConfig(req.params.id as string, req.body)
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admission config updated successfully",
        data: result
    })
})

export const admissionConfigController = {
    createAdmissionConfig,
    getAllAdmissionConfig,
    updateAdmissionConfig
}