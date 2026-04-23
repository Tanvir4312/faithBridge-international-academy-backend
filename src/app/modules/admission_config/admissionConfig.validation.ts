import { z } from "zod";

export const admissionConfigSchema = z.object({
    startDate: z
        .preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date())
        .nullable()
        .optional(),

    endDate: z
        .preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date())
        .nullable()
        .optional(),

    isActive: z.boolean().default(false),

    year: z
        .string()
        .regex(/^\d{4}$/, "Year must be a 4-digit number (e.g., 2026)")
        .nullable()
        .optional(),
}).refine((data) => {

    if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
    }
    return true;
}, {
    message: "End date must be after the start date",
    path: ["endDate"],
});

export type TCreateAdmissionConfig = z.infer<typeof admissionConfigSchema>;

export const updateAdmissionConfigSchema = z.object({
    startDate: z
        .preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date())
        .nullable()
        .optional(),

    endDate: z
        .preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date())
        .nullable()
        .optional(),

    isActive: z.boolean().default(false),

    year: z
        .string()
        .regex(/^\d{4}$/, "Year must be a 4-digit number (e.g., 2026)")
        .nullable()
        .optional(),
}).refine((data) => {

    if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
    }
    return true;
}, {
    message: "End date must be after the start date",
    path: ["endDate"],
});

export type TUpdateAdmissionConfig = z.infer<typeof updateAdmissionConfigSchema>;