import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.inteface";
import { prisma } from "../../lib/prisma";
import { ICreateApplicationPayload } from "./application.interface";
import { v7 as uuidv7 } from "uuid";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";
import { Role } from "../../../generated/prisma/enums";
import { generateRegistrationId } from "./application.constant";

const createApplication = async (
  payload: ICreateApplicationPayload,
  user: IRequestUser,
) => {
  const alreadyApplied = await prisma.application.findFirst({
    where: {
      userId: user.userId,
    },
  });

  if (alreadyApplied) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already applied for a job",
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const lastApp = await tx.application.findFirst({
      orderBy: { createdAt: "desc" },
    });
    const nextId = lastApp
      ? parseInt(lastApp.applicationNo.split("-")[2]) + 1
      : 1;
    const applicationNo = `FB-2026-${nextId.toString().padStart(4, "0")}`;

    const applicationFee = 1200;

    const application = await tx.application.create({
      data: {
        ...payload,
        userId: user.userId,
        applicationNo: applicationNo,
        applicationFee,
      },
      include: {
        user: true,
      },
    });
    //TODO : Payment Integration will be here
    const transactionId = String(uuidv7());

    const paymentData = await tx.payment.create({
      data: {
        applicationId: application.id,
        amount: application.applicationFee,
        paymentFor: "ADMISSION",
        transactionId,
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
              name: `Admission Application: ${application.nameEn}`,
              description: `Class: ${application.desiredClass} | Session: ${application.admissionYear}`,
            },
            unit_amount: applicationFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        applicationId: application.id,
        paymentId: paymentData.id,
      },

      success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,

      // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
      cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments`,
    });

    return {
      application,
      paymentData,
      paymentUrl: session.url,
    };
  });
  return {
    application: result.application,
    paymentData: result.paymentData,
    paymentUrl: result.paymentUrl,
  };
};

const getAllApplication = async () => {
  const result = await prisma.application.findMany({
    include: {
      user: true,
      payment: {
        select: {
          amount: true,
          paymentFor: true,
          status: true,
          transactionId: true,
          stripeEventId: true,
        },
      },
    },
  });
  return result;
};

const getApplicationById = async (id: string) => {
  const result = await prisma.application.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const getOwnApplication = async (id: string, user: IRequestUser) => {
  const applicationdata = await prisma.application.findUnique({
    where: {
      userId: user.userId,
    },
  });

  if (applicationdata?.id !== id) {
    throw new AppError(
      status.UNAUTHORIZED,
      "You are not authorized to view this application",
    );
  }
  return applicationdata;
};

const applicationSoftDelete = async (id: string) => {
  const result = await prisma.application.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return result;
};

const applicationUpdateByAdmin = async (id: string) => {
  const isApplicationExist = await prisma.application.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      payment: true,
      student: true,
    },
  });

  if (!isApplicationExist) {
    throw new AppError(status.NOT_FOUND, "Application not found");
  }

  if (isApplicationExist.student?.id) {
    throw new AppError(status.BAD_REQUEST, "Application is already accepted");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      if (isApplicationExist.paymentStatus !== "PAID") {
        throw new AppError(
          status.BAD_REQUEST,
          "Only paid application can be updated",
        );
      }
      if (isApplicationExist.status === "REJECTED") {
        throw new AppError(
          status.BAD_REQUEST,
          "Application is already rejected",
        );
      }

      if (isApplicationExist.status === "APPROVED") {
        throw new AppError(
          status.BAD_REQUEST,
          "Application is already accepted",
        );
      }
      await tx.application.update({
        where: {
          id,
        },
        data: {
          status: "APPROVED",
          updatedAt: new Date(),
        },
      });

      await tx.user.update({
        where: {
          id: isApplicationExist.userId,
        },
        data: {
          role: Role.STUDENT,
        },
      });

      const primaryClasses = ["one", "two", "three", "four", "five"];
      const academicData = primaryClasses.includes(
        isApplicationExist.desiredClass,
      )
        ? "PRIMARY"
        : "SECONDARY";

      const academic_level = await tx.academicLevel.create({
        data: {
          name: academicData,
        },
      });

      const classData = await tx.class.create({
        data: {
          name: isApplicationExist.desiredClass,
          AcademicLevelId: academic_level.id,
        },
      });

      const regId = await generateRegistrationId(tx);

      const student = await tx.student.create({
        data: {
          userId: isApplicationExist.userId,
          applicationId: isApplicationExist.id,
          nameBn: isApplicationExist.nameBn,
          nameEn: isApplicationExist.nameEn,
          fatherName: isApplicationExist.fatherName,
          motherName: isApplicationExist.motherName,
          guardianMobile: isApplicationExist.guardianMobile,
          presentAddress: isApplicationExist.presentAddress,
          permanentAddress: isApplicationExist.permanentAddress,

          bloodGroup: isApplicationExist.bloodGroup,
          dob: isApplicationExist.dob,
          gender: isApplicationExist.gender,
          religion: isApplicationExist.religion,
          birthCertificateNo: isApplicationExist.birthCertificateNo,

          classId: classData.id,
          registrationId: regId,
        },
        include: {
          class: true,
        },
      });

      if (student) {
        await tx.payment.update({
          where: {
            id: isApplicationExist.payment?.id,
          },
          data: {
            studentId: student.id,
          },
        });

        await tx.studentClassHistory.create({
          data: {
            studentId: student.id,
            classId: classData.id,
            year: new Date().getFullYear().toString(),
          },
        });
      }
    });
    return result;
  } catch (error) {
    console.log(error);
    const isApplicationExist = await prisma.application.findUnique({
      where: {
        id,
      },
    });
    if (!isApplicationExist) {
      throw new AppError(status.NOT_FOUND, "Application not found");
    }
    await prisma.student.delete({
      where: {
        userId: isApplicationExist.userId,
      },
    });
  }
};
export const ApplicationService = {
  createApplication,
  getAllApplication,
  getApplicationById,
  getOwnApplication,
  applicationSoftDelete,
  applicationUpdateByAdmin,
};
