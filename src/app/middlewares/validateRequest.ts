import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedResult = zodSchema.safeParse(req.body);

    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }

    if (!parsedResult.success) {
      next(parsedResult.error);
    }

    // senitize the data
    req.body = parsedResult.data;
    next();
  };
};
