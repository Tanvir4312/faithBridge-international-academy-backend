import { z } from "zod";

export const examSchema = z.object({
  id: z
    .string()
    .uuid("Invalid ID format")
    .optional(),

  name: z
    .string()
    .min(2, "Exam name too short")
    .max(100, "Exam name too long"),

  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a valid 4 digit year (e.g. 2026)"),

  formFillupStart: z.coerce.date({
    message: "Invalid form fill-up start date",
  }),

  formFillupEnd: z.coerce.date({
    message: "Invalid form fill-up end date",
  }),
}).refine(
  (data) => data.formFillupEnd > data.formFillupStart,
  {
    message: "Form fill-up end date must be after start date",
    path: ["formFillupEnd"],
  }
);
export const examUpdateSchema = z.object({


  name: z
    .string()
    .min(2, "Exam name too short")
    .max(100, "Exam name too long").optional(),

  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a valid 4 digit year (e.g. 2026)").optional(),

  formFillupStart: z.coerce.date({
    message: "Invalid form fill-up start date",
  }).optional(),

  formFillupEnd: z.coerce.date({
    message: "Invalid form fill-up end date",
  }).optional(),

  examDate: z.coerce.date({
    message: "Invalid exam date",
  }).optional(),
}).refine(
  (data) => {
    if (data.formFillupEnd && data.formFillupStart) {
      return data.formFillupEnd > data.formFillupStart;
    }
    if (data.examDate && data.formFillupEnd) {
      return data.examDate > data.formFillupEnd;
    }
    if (data.examDate && data.formFillupStart) {
      return data.examDate > data.formFillupStart;
    }
    return true;
  },
  {
    message: "Form fill-up end date must be after start date",
    path: ["formFillupEnd"],
  }
);