import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
// import { prisma } from "../../lib/prisma";
import { IRegisterData } from "./auth.interface";

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
  return data;
};

export const AuthServices = {
  registerApplicant,
};
