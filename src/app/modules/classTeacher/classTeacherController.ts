import status from "http-status";
import { catchAsync } from "../../shared/cathAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ClassTeacherService } from "./classTeacher.service";

const createClassTeacher = catchAsync(async (req, res) => {
    const result = await ClassTeacherService.createClassTeacher(req.body);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        message: "Class teacher created successfully",
        success: true,
        data: result,
    });
});

const getAllClassTeacher = catchAsync(async (req, res) => {
    const result = await ClassTeacherService.getAllClassTeacher();
    sendResponse(res, {
        httpStatusCode: status.OK,
        message: "Class teachers fetched successfully",
        success: true,
        data: result,
    });
});

const deleteClassTeacher = catchAsync(async (req, res) => {
    const result = await ClassTeacherService.deleteClassTeacher(req.params.id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        message: "Class teacher deleted successfully",
        success: true,
        data: result,
    });
});



export const ClassTeacherController = {
    createClassTeacher,
    getAllClassTeacher,
    deleteClassTeacher

};