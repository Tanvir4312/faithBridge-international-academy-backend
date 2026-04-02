import { NextFunction, Request, RequestHandler, Response } from "express";

export const cathAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
};
