import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IClassTeacherPayload } from "./classTeacher.interface";

const createClassTeacher = async (payload: IClassTeacherPayload) => {
    const { classId, teacherId } = payload

    const teacher = await prisma.teacher.findUnique({
        where: {
            id: teacherId
        }
    })
    if (!teacher) {
        throw new AppError(status.NOT_FOUND, "Teacher not found");
    }

    const classData = await prisma.class.findUnique({
        where: {
            id: classId
        }
    })
    if (!classData) {
        throw new AppError(status.NOT_FOUND, "Class not found");
    }

    const isClassTeacherExist = await prisma.classTeacher.findUnique({
        where: {

            classId,
            teacherId

        }
    })
    if (isClassTeacherExist) {
        throw new AppError(status.BAD_REQUEST, "Class teacher already exist");
    }

    const classTeacher = await prisma.classTeacher.create({
        data: {
            classId,
            teacherId
        }
    })
    return classTeacher;

}

export const ClassTeacherService = {
    createClassTeacher
}