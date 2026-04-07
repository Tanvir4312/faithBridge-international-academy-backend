import { z } from "zod";

export const updateStudentSchema = z.object({
  nameBn: z
    .string()
    .min(2, "বাংলা নাম খুব ছোট")  // অন্তত 2 অক্ষর
    .max(100, "বাংলা নাম খুব বড়")
    .optional(),

  nameEn: z
    .string()
    .min(2, "English name too short")
    .max(100, "English name too long")
    .optional(),

  fatherName: z
    .string()
    .min(2, "Father's name too short")
    .max(100, "Father's name too long")
    .optional(),

  motherName: z
    .string()
    .min(2, "Mother's name too short")
    .max(100, "Mother's name too long")
    .optional(),

  profileImage: z
    .string()
    .url("Profile image must be a valid URL")
    .optional(),

  guardianMobile: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Guardian mobile must be a valid number")
    .optional(),

  studentMobile: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Student mobile must be a valid number")
    .optional(),

  presentAddress: z
    .string()
    .min(5, "Present address too short")
    .max(250, "Present address too long")
    .optional(),

  permanentAddress: z
    .string()
    .min(5, "Permanent address too short")
    .max(250, "Permanent address too long")
    .optional(),
});