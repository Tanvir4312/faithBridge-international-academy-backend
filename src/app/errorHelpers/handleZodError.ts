import status from "http-status";
import {
  ITErrorResponse,
  ITErrorSources,
} from "../interfaces/error.interfaces";
import z from "zod";

export const simplifiedZodError = (err: z.ZodError): ITErrorResponse => {
  const statusCode = status.BAD_REQUEST;
  const message = "Zod validation error";
  const errorSources: ITErrorSources[] = [];

  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" -->"),
      message: issue.message,
    });
  });

  return {
    success: false,
    statusCode,
    message,
    errorSources,
    stack: err.stack,
  };
};
