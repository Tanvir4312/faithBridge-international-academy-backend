import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
// import { prisma } from "../../lib/prisma";
import { ILoginData, IRegisterData } from "./auth.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { tokenUtils } from "../../utils/token";

const registerApplicant = async (payload: IRegisterData) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
  if (!data.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to register user");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });
  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: ILoginData) => {
  const data = await auth.api.signInEmail({
    body: {
      email: payload.email,
      password: payload.password,
    },
  });
  if (data.user.status === UserStatus.SUSPENDED) {
    throw new AppError(status.BAD_REQUEST, "User is suspended");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  registerApplicant,
  loginUser,
};
