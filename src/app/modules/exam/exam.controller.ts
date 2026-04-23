import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { ExamService } from "./exam.service";

const createExam = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamService.createExam(req.body);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        message: "Exam created successfully",
        success: true,
        data: result,
    });
});

const getAllExam = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamService.getAllExam();
    sendResponse(res, {
        httpStatusCode: status.OK,
        message: "Exam fetched successfully",
        success: true,
        data: result,
    });
});

const updateExam = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamService.updateExam(req.body, req.params.id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        message: "Exam updated successfully",
        success: true,
        data: result,
    });
});

const deleteExam = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamService.deleteExam(req.params.id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        message: "Exam deleted successfully",
        success: true,
        data: result,
    });
});

export const ExamController = {
    createExam,
    getAllExam,
    updateExam,
    deleteExam
};