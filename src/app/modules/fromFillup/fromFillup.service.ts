import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import {
  ICreateFromFillupPayload,
  IUpdateFromFillupStatusPayload,
} from "./fromFillup.interface";
import { prisma } from "../../lib/prisma";
import { v7 as uuidv7 } from "uuid";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";
const createFromFillup = async (payload: ICreateFromFillupPayload) => {
  const alreadyFromFillup = await prisma.formFillup.findUnique({
    where: {
      studentId_examId: {
        studentId: payload.studentId,
        examId: payload.examId,
      },
    },
  });
  if (alreadyFromFillup) {
    throw new AppError(status.BAD_REQUEST, "Already filled up");
  }
  const student = await prisma.student.findUnique({
    where: { id: payload.studentId },
  });
  if (!student) {
    throw new AppError(status.NOT_FOUND, "Student not found");
  }

  if (student.registrationId !== payload.registrationNo) {
    throw new AppError(status.BAD_REQUEST, "Invalid registration no");
  }

  if (student.classRoll !== payload.classRoll) {
    throw new AppError(status.BAD_REQUEST, "Invalid class roll");
  }

  if (student.classId !== payload.classId) {
    throw new AppError(status.BAD_REQUEST, "Invalid class");
  }
  const exam = await prisma.exam.findUnique({
    where: { id: payload.examId },
  });
  if (!exam) {
    throw new AppError(status.NOT_FOUND, "Exam not found");
  }
  const result = await prisma.$transaction(async (tx) => {
    const fromFillupData = await tx.formFillup.create({
      data: payload,
    });

    const studentClass = await tx.class.findUnique({
      where: { id: payload.classId },
    });
    if (!studentClass) {
      throw new AppError(status.NOT_FOUND, "Class not found");
    }

    const classes = ["one", "two", "three", "four", "five"];
    const fromFilupFee = classes.includes(studentClass.name) ? 700 : 1500;

    //payment
    const transactionId = String(uuidv7());

    const paymentData = await tx.payment.create({
      data: {
        formFillupId: fromFillupData.id,
        amount: fromFilupFee,
        paymentFor: "FORM_FILLUP",
        transactionId,
      },
    });

    await tx.payment.update({
      where: {
        id: paymentData.id,
      },
      data: {
        studentId: student.id,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Exam Form Fillup: ${student.nameEn}`,
              description: `Class: ${studentClass.name} | Exam: ${exam.name} ${exam.year}`,
            },
            unit_amount: fromFilupFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        fromFillupId: fromFillupData.id,
        paymentId: paymentData.id,
      },

      success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,

      // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
      cancel_url: `${envVars.FRONTEND_URL}/dashboard/from-fillup`,
    });

    if (fromFillupData.status === "APPROVED") {
      // TODO SEND EMAIL AFTER from fillup approved
    }

    return {
      fromFillupData,
      paymentData,
      paymentUrl: session.url,
    };
  });
  return {
    fromFillupData: result.fromFillupData,
    paymentData: result.paymentData,
    paymentUrl: result.paymentUrl,
  };
};

const getAllFromFillup = async () => {
  const result = await prisma.formFillup.findMany();
  return result;
};

const updateFromFillUpStatus = async (
  payload: IUpdateFromFillupStatusPayload,
  id: string,
) => {
  const result = await prisma.formFillup.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });
  return result;
};

const deleteFromFillup = async (id: string) => {
  const fromFillup = await prisma.formFillup.findUnique({
    where: {
      id,
    },
  });
  if (!fromFillup) {
    throw new AppError(status.NOT_FOUND, "From fillup not found");
  }
  const result = await prisma.formFillup.delete({
    where: {
      id,
      status: "PENDING",
    },
  });
  return result;
};

export const FromFillupService = {
  createFromFillup,
  updateFromFillUpStatus,
  getAllFromFillup,
  deleteFromFillup,
};
