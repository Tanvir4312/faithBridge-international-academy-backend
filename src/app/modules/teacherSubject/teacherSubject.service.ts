import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  ICreateAssignSubjectToTeacher,
  ITeacherPrimarySubjetUpdate,
  ITeacherSubjetDelete,
} from "./teacherSubject.interface";
import { Subject } from "../../../generated/prisma/client";


const assignSubjectToTeacher = async (
  payload: ICreateAssignSubjectToTeacher,
) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: payload.teacherId,
      isDeleted: false,
    },
    include: {
      teacherSubjects: true,
    },
  });

  if (!teacher) {
    throw new AppError(status.NOT_FOUND, "Teacher not found");
  }

  for (const subjectId of payload.subjectsId) {
    const duplicateSubject = teacher.teacherSubjects.find(
      (teacherSubject) => teacherSubject.subjectId === subjectId,
    );
    if (duplicateSubject) {
      throw new AppError(
        status.BAD_REQUEST,
        "Subject already assigned to teacher",
      );
    }
  }

  const { subjectsId, teacherId } = payload;
  const subjectsArr: Subject[] = [];
  for (const subjectId of subjectsId) {
    const subjectsData = await prisma.subject.findUnique({
      where: {
        id: subjectId,
        isDeleted: false,
      },
    });

    if (!subjectsData) {
      throw new AppError(status.NOT_FOUND, "Subject not found");
    }
    subjectsArr.push(subjectsData);
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const teacherSubjectField = [];
      for (const subject of subjectsArr) {
        const teacherSubject = await tx.teacherSubject.create({
          data: {
            teacherId,
            subjectId: subject.id,
          },
          select: {
            subject: {
              select: {
                name: true
              }
            },
            teacher: {
              select: {
                name: true
              }
            }
          }
        });
        teacherSubjectField.push(teacherSubject);
      }
      return teacherSubjectField;
    });
    return result;
  } catch (error) {
    console.log(error);
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Error assigning subject to teacher",
    );
  }
};

const teacherPrimarySubjectUpdate = async (
  payload: ITeacherPrimarySubjetUpdate,

) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: payload.teacherId,
    },
    include: {
      teacherSubjects: true,
    },
  });
  if (!teacher) {
    throw new AppError(status.NOT_FOUND, "Teacher not found");
  }
  return await prisma.$transaction(async (tx) => {
    await tx.teacherSubject.updateMany({
      where: {
        teacherId: payload.teacherId,
      },
      data: {
        isPrimary: false,
      },
    });
    const { teacherId, subjectId } = payload;
    const update = await tx.teacherSubject.update({
      where: {
        teacherId_subjectId: { teacherId, subjectId },
      },
      data: {
        isPrimary: true,
      },
    });
    return update;
  });
};

const teacherSubjectDelete = async (payload: ITeacherSubjetDelete) => {
  console.log(payload);
  const teacherSubject = await prisma.teacherSubject.findUnique({
    where: {
      teacherId_subjectId: {
        teacherId: payload.teacherId,
        subjectId: payload.subjectId,
      },
    },
  });
  if (!teacherSubject) {
    throw new AppError(status.NOT_FOUND, "Teacher subject not found");
  }
  return await prisma.teacherSubject.delete({
    where: {
      teacherId_subjectId: payload,
    },
  });
}

export const TeacherSubjectService = {
  teacherPrimarySubjectUpdate,
  assignSubjectToTeacher,
  teacherSubjectDelete,

};
