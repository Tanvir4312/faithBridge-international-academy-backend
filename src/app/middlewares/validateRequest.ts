import { NextFunction, Request, Response } from "express";
import status from "http-status";
import z from "zod";
import AppError from "../errorHelpers/AppError";

export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }

    const parsedResult = zodSchema.safeParse(req.body);

    if (!parsedResult.success) {
      return next(parsedResult.error);
    }

    // senitize the data
    req.body = parsedResult.data;
    next();
  };
};


// export const validateRequest = (zodSchema: z.ZodObject<any>) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // যদি data ফিল্ড থাকে এবং সেটি খালি না হয় তবেই parse করবে
//       if (req.body && req.body.data) {
//         try {
//           req.body = JSON.parse(req.body.data);
//         } catch (parseErr) {
//           // যদি parsing এ সমস্যা হয়
//           return next(new AppError(status.BAD_REQUEST, "Invalid JSON data provided in 'data' field"));
//         }
//       } else {
//         // যদি data ফিল্ড না থাকে (যেমন শুধু ইমেজ পাঠালে),
//         // তখন req.body কে খালি অবজেক্ট করে দিন যদি সেটা undefined হয়
//         req.body = req.body || {};

//         // অনেক সময় multer বডিতে কিছু না থাকলে req.body কে {} রাখে না,
//         // তাই safe-side এর জন্য এটি করা ভালো।
//         if (Object.keys(req.body).length === 0 && !req.body.data) {
//           req.body = {};
//         }
//       }

//       const parsedResult = zodSchema.safeParse(req.body);

//       if (!parsedResult.success) {
//         return next(parsedResult.error);
//       }

//       req.body = parsedResult.data;
//       return next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };