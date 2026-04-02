/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
interface IResponseData<T> {
  httpStatusCode: number;
  message: string;
  data?: T;
  success: boolean;
  meta?: any;
}

export const sendResponse = <T>(
  res: Response,
  responseData: IResponseData<T>,
) => {
  const { httpStatusCode, message, data, success, meta } = responseData;

  return res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta,
  });
};
