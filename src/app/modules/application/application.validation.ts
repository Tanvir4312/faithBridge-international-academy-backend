import { z } from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createStudentApplicationSchema = z.object({
  nameBn: z
    .string("বাংলায় নাম অবশ্যই দিতে হবে")
    .min(3, "বাংলায় নাম অন্তত ৩ অক্ষরের হতে হবে"),

  nameEn: z
    .string("Name in English is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  fatherName: z
    .string("Father's name is required")
    .min(3, "Father's name must be at least 3 characters"),

  motherName: z
    .string("Mother's name is required")
    .min(3, "Mother's name must be at least 3 characters"),

  guardianMobile: z
    .string("Guardian's mobile number is required")
    .min(11, "Mobile number must be 11 digits")
    .max(14, "Invalid mobile number"),

  studentMobile: z
    .string("Student's mobile number must be a string")
    .min(11, "Mobile number must be 11 digits")
    .optional(),

  dob: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      const date = new Date(arg);
      return isNaN(date.getTime()) ? undefined : date;
    }
  }, z.date("Date of birth is required")),
  gender: z.enum(
    [Gender.MALE, Gender.FEMALE],
    "Gender must be MALE, FEMALE or OTHER",
  ),

  religion: z
    .string("Religion is required")
    .min(3, "Please enter a valid religion"),

  bloodGroup: z.string("Blood group must be a string").optional(),

  birthCertificateNo: z
    .string("Birth certificate number is required")
    .min(10, "Birth certificate number is too short")
    .max(20, "Birth certificate number is too long"),

  presentAddress: z
    .string("Present address is required")
    .min(10, "Present address must be at least 10 characters"),

  permanentAddress: z
    .string("Permanent address is required")
    .min(10, "Permanent address must be at least 10 characters"),

  previousSchool: z.string("Previous school name must be a string").optional(),

  desiredClass: z.string("Desired class is required"),

  admissionYear: z.string("Admission year is required"),

  profileImage: z
    .string("Profile image is required")
    .url("Profile image must be a valid URL")
    .optional(),

  signatureImage: z
    .string("Signature image must be a string")
    .url("Signature image must be a valid URL")
    .optional(),
});
