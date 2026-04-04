/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import {
  ITErrorResponse,
  ITErrorSources,
} from "../interfaces/error.interfaces";
import status from "http-status";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import z from "zod";
import { simplifiedZodError } from "../errorHelpers/handleZodError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from global error handler ", err);
  }
  let errorSources: ITErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Something went wrong";
  let stack: string | undefined = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof z.ZodError) {
    const simplified = simplifiedZodError(err);
    statusCode = simplified.statusCode as number;
    message = simplified.message as string;
    stack = simplified.stack as string | undefined;
    errorSources = [...simplified.errorSources];
  } else if (err instanceof Error) {
    statusCode = status.BAD_REQUEST;
    message = err.message;
    stack = err.stack;
  }

  const response: ITErrorResponse = {
    success: false,
    message: message,
    errorSources: errorSources,
    stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
    error: envVars.NODE_ENV === "development" ? err.message : undefined,
  };
  res.status(statusCode).json(response);
};
