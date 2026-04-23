/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";

import status from "http-status";
import AppError from "../../errorHelpers/AppError";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  // console.log("event====>", event);
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed, skipping`);
    return { message: `Event ${event.id} already processed, skipping` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // console.log("session==>", session.payment_status)
      const { applicationId, fromFillupId, paymentId } = session.metadata || {};

      await prisma.$transaction(async (tx) => {
        if (paymentId) {
          await tx.payment.update({
            where: { id: paymentId },
            data: {
              stripeEventId: event.id,
              status:
                session.payment_status === "paid"
                  ? PaymentStatus.PAID
                  : PaymentStatus.UNPAID,
              paymentGatewayData: session as any,
            },
          });
        }
        if (applicationId) {
          await tx.application.update({
            where: { id: applicationId },
            data: {
              paymentStatus:
                session.payment_status === "paid"
                  ? PaymentStatus.PAID
                  : PaymentStatus.UNPAID,
            },
          });
        }

        if (fromFillupId) {
          await tx.formFillup.update({
            where: { id: fromFillupId },
            data: {
              paymentStatus:
                session.payment_status === "paid"
                  ? PaymentStatus.PAID
                  : PaymentStatus.UNPAID,
            },
          });
        }
      });

      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed.`,
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;

      console.log(
        `Payment intent ${session.id} failed. Marking associated payment as failed.`,
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: `Webhook Event ${event.id} processed successfully` };
};

const getAllPayment = async () => {
  const result = await prisma.payment.findMany({
    select: {
      paymentFor: true,
      amount: true,
      status: true,

      createdAt: true,
      updatedAt: true,

      student: {
        select: {
          class: {
            select: {
              name: true
            }
          },
          classRoll: true,
          nameEn: true,
          registrationId: true
        }
      }
    },

  });
  return result;
};

const getPaymentByStudentId = async (studentId: string) => {
  const isStudent = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });
  if (!isStudent) {
    throw new AppError(status.NOT_FOUND, "Student not found");
  }
  if (isStudent?.id !== studentId) {
    throw new AppError(status.FORBIDDEN, "You are not authorized to access this payment");
  }
  const result = await prisma.payment.findMany({
    where: {
      studentId,
    },
    select: {
      id: true,
      paymentFor: true,
      amount: true,
      status: true,
      transactionId: true,
      createdAt: true,
      updatedAt: true,
      student: {
        select: {
          class: {
            select: {
              name: true
            }
          },
          classRoll: true,
          nameEn: true,
          registrationId: true
        }
      }
    }
  });
  return result;
};

const getPaymentByApplicantId = async (applicantId: string) => {
  const isApplicant = await prisma.application.findUnique({
    where: {
      id: applicantId,
    },
  });
  if (!isApplicant) {
    throw new AppError(status.NOT_FOUND, "Student not found");
  }
  if (isApplicant?.id !== applicantId) {
    throw new AppError(status.FORBIDDEN, "You are not authorized to access this payment");
  }
  const result = await prisma.payment.findMany({
    where: {
      applicationId: applicantId,
    },
    select: {
      id: true,
      paymentFor: true,
      amount: true,
      status: true,
      transactionId: true,
      createdAt: true,
      updatedAt: true,
      application: {
        select: {
          nameEn: true,
          fatherName: true,
          desiredClass: true,
          applicationNo: true
        }
      }
    }
  });
  return result;
};

export const PaymentService = {
  handleStripeWebhookEvent,
  getAllPayment,
  getPaymentByStudentId,
  getPaymentByApplicantId,
};
