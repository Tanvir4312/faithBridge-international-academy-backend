import { z } from "zod";
import { Gender } from "../../../generated/prisma/index.js";

export const updateTeacherValidationSchema = z.object({

  name: z
    .string("Name must be a string")
    .min(5, "Name must be at least 5 characters")
    .max(30, "Name must be at most 30 characters")
    .optional(),

  email: z
    .email("Please provide a valid email address")
    .optional(),

  contactNumber: z
    .string("Contact number must be a string")
    .min(11, "Contact number must be at least 11 characters")
    .max(15, "Contact number must be at most 15 characters")
    .optional(),

  address: z
    .string("Address must be a string")
    .min(10, "Address must be at least 10 characters")
    .max(100, "Address must be at most 100 characters")
    .optional(),

  qualification: z
    .string("Qualification must be a string")
    .min(2, "Qualification must be at least 2 characters")
    .max(50, "Qualification must be at most 50 characters")
    .optional(),

  gender: z
    .enum(
      [Gender.MALE, Gender.FEMALE],
      "Gender must be either MALE, FEMALE or OTHER",
    )
    .optional(),

  profilePhoto: z

    .url("Profile photo must be a valid URL")
    .optional(),

  designation: z
    .string("Designation must be a string")
    .min(2, "Designation must be at least 2 characters")
    .max(50, "Designation must be at most 50 characters")
    .optional(),
})


// subjects: z
//   .array(
//     z.object({
//       subjectId: z.string("Subject ID must be a string"),
//       isDeleted: z
//         .boolean("isDeleted must be a boolean")
//         .optional()
//         .default(false),
//     }),
//   )
//   .optional(),

