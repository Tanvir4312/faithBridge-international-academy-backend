import { z } from "zod";

export const AcademicLevelCreateZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),

  image: z.url({ message: "Image must be a valid URL" }).optional(),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .optional(),
});
export const AcademicLevelUpdateZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),

  image: z.url({ message: "Image must be a valid URL" }).optional(),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .optional(),
});
