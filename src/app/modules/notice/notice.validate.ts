import { z } from "zod";

export const createNoticeSchema = z
  .object({
    title: z.string().min(1,  "Title is required" ),

    details: z.string().optional(),

    type: z.enum(["GENERAL", "CLASS_SPECIFIC"]),

    noticeClasses: z
      .array(z.string().min(1,  "Class ID is required" ))
      .optional(),
  })
  .superRefine((data, ctx) => {
   
    if (data.type === "CLASS_SPECIFIC") {
      if (!data.noticeClasses || data.noticeClasses.length === 0) {
        ctx.addIssue({
          code: "custom",
          message:
            "At least one class is required for CLASS_SPECIFIC notice",
          path: ["noticeClasses"],
        });
      }
    }

   
    if (data.type === "GENERAL" && data.noticeClasses?.length) {
      ctx.addIssue({
        code: "custom",
        message: "GENERAL notice should not have classes",
        path: ["noticeClasses"],
      });
    }
  });