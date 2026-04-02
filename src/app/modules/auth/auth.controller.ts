import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { AuthServices } from "./auth.services";
import { sendResponse } from "../../shared/sendResponse";

const registerApplicant = catchAsync(async (req : Request, res : Response) => {
    const result = await AuthServices.registerApplicant(req.body);

    sendResponse(res, {
      httpStatusCode: 201,
      message: "User created successfully",
      data: result,
      success: true,
    });
});

export const AuthController = { registerApplicant };