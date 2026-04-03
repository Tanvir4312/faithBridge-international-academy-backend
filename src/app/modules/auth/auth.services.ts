/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
// import { prisma } from "../../lib/prisma";
import {
  IChangePasswordPayload,
  ILoginData,
  IRegisterData,
} from "./auth.interface";
import {  UserStatus } from "../../../generated/prisma/enums";
import { tokenUtils } from "../../utils/token";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interfaces/requestUser.inteface";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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

const getMe = async (user: IRequestUser) => {
  return await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      teacher: true,
      student: true,
      applications: true,
    },
  });
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isExistingSessionToken = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });
  if (!isExistingSessionToken) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Unauthorized access! No session token provided.",
    );
  }

  const verifyRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET as string,
  );
  if (!verifyRefreshToken) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Unauthorized access! Invalid token.",
    );
  }

  const data = verifyRefreshToken.data as JwtPayload;

  const newAccesToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    email: data.email,
    name: data.name,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    email: data.email,
    name: data.name,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccesToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
};

const changePassword = async (
  payload: IChangePasswordPayload,
  sessionToken: string,
) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (!session) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const { currentPassword, newPassword } = payload;

  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        needPasswordChange: false,
      },
    });
  }

  const newAccessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  });

  return {
    ...result,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  return result;
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });
  if (result.user && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        id: result.user.id,
      },
      data: {
        emailVerified: true,
      },
    });
  }
};

const forgotPassword = async (email: string) => {
  const isExistUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isExistUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (!isExistUser.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "User is not verified");
  }

  if (isExistUser.isDeleted && isExistUser.status === UserStatus.SUSPENDED) {
    throw new AppError(status.BAD_REQUEST, "User is suspended");
  }

  const result = await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
  return result;
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const isExistUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isExistUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (!isExistUser.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "User is not verified");
  }

  if (isExistUser.isDeleted && isExistUser.status === UserStatus.SUSPENDED) {
    throw new AppError(status.BAD_REQUEST, "User is suspended");
  }

  if (isExistUser.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isExistUser.id,
      },
      data: {
        needPasswordChange: false,
      },
    });
  }

  const result = await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });

  await prisma.session.deleteMany({
    where: {
      userId: isExistUser.id,
    },
  });
  return result;
};

const googleLoginSuccess = async (session: Record<string, any>) => {
  const isApplicantExist = await prisma.user.findUnique({
    where: {
      email: session.user.email,
     
    },
  });
  if (!isApplicantExist) {
    await prisma.user.create({
      data: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  });
  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  registerApplicant,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleLoginSuccess,
};
