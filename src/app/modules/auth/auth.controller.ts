import { Request, Response } from "express";
import { catchAsync } from "../../shared/cathAsync";
import { AuthServices } from "./auth.services";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const registerApplicant = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.registerApplicant(req.body);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefresfhTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: 201,
    message: "User created successfully",
    success: true,
    data: {
      ...rest,
      token,
      accessToken,
      refreshToken,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefresfhTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "User logged in successfully",
    success: true,
    data: {
      ...rest,
      token,
      accessToken,
      refreshToken,
    },
  });
});

export const AuthController = {
  registerApplicant,
  loginUser,
};
