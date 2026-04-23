import { prisma } from "../../lib/prisma";
import { TCreateAdmissionConfig, TUpdateAdmissionConfig } from "./admissionConfig.validation";

export const createAdmissionConfig = async (payload: TCreateAdmissionConfig) => {
    const result = await prisma.admissionConfig.create({
        data: payload
    })
    return result
}

export const getAllAdmissionConfig = async () => {
    const result = await prisma.admissionConfig.findMany()
    return result
}

export const updateAdmissionConfig = async (id: string, payload: TUpdateAdmissionConfig) => {
    const result = await prisma.admissionConfig.update({
        where: { id },
        data: payload
    })
    return result
}

export const admissionConfigService = {
    createAdmissionConfig,
    getAllAdmissionConfig,
    updateAdmissionConfig
}
