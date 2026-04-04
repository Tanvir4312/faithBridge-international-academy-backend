import { Subject } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSubject = async (payload: Subject) => {
  const result = await prisma.subject.create({ data: payload });
  return result;
};

const getAllSubject = async () => {
  const result = await prisma.subject.findMany();
  return result;
};

const subjectUpdate = async (id: string, payload: Subject) => {
  const result = await prisma.subject.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const subjectDelete = async (id: string) => {
  const result = await prisma.subject.delete({
    where: {
      id,
    },
  });
  return result;
}

export const SubjectService = {
  createSubject,
  getAllSubject,
  subjectUpdate,
  subjectDelete
};
