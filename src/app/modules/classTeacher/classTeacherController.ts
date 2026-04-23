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



export const ClassTeacherController = {
    createClassTeacher,

};