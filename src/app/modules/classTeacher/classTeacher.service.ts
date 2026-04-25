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

    const alreadyAssignedTeacher = await prisma.classTeacher.findUnique({
        where: {

            classId,
            teacherId

        }
    })
    if (alreadyAssignedTeacher) {
        throw new AppError(status.BAD_REQUEST, `This teacher is already assigned to this class`);
    }
    // check if teacher is assigned to any class
    const isTeacherAssignedToAnyClass = await prisma.classTeacher.findUnique({
        where: {
            teacherId
        },
        include: {
            class: {
                select: {
                    name: true
                }
            }
        }
    })
    if (isTeacherAssignedToAnyClass) {
        throw new AppError(status.BAD_REQUEST, `This teacher is already assigned to class ${isTeacherAssignedToAnyClass.class.name}`);
    }
    // check if class is assigned to any teacher
    const isClassAssignedToTeacher = await prisma.classTeacher.findUnique({
        where: {
            classId
        },
        include: {
            teacher: {
                select: {
                    name: true
                }
            }
        }
    })
    if (isClassAssignedToTeacher) {
        throw new AppError(status.BAD_REQUEST, `This class is already assigned to a teacher ${isClassAssignedToTeacher.teacher.name}`);
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