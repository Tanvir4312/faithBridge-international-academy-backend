/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.inteface";
import { prisma } from "../../lib/prisma";
import { ICreateApplicationPayload } from "./application.interface";
import { v7 as uuidv7 } from "uuid";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";
import { Role } from "../../../generated/prisma/enums";

import { sendEmail } from "../../utils/email";
import { generateRegistrationId } from "./application.generateRegistrationId";
import { ApplicationWhereInput } from "../../../generated/prisma/models";

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
    // TODO SEND EMAIL AFTER CREATING APPLICATION

    const transactionId = String(uuidv7());

    const paymentData = await tx.payment.create({
      data: {
        applicationId: application.id,
        amount: application.applicationFee,
        paymentFor: "ADMISSION",
        transactionId,
      },
    });
    return {
      application,
      paymentData,

    };
  });


  //TODO CREATE PAYMENT INVOICE PDF AND SENDING PAYMENT INVOICE EMAIL
  const session = await stripe.checkout.sessions.create({

    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Admission Application: ${result.application.nameEn}`,
            description: `Class: ${result.application.desiredClass} | Session: ${result.application.admissionYear}`,
          },
          unit_amount: result.application.applicationFee * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      applicationId: result.application.id,
      paymentId: result.paymentData.id,
    },

    success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,

    // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
    cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments`,
  });

  // SEND EMAIL AFTER CREATING APPLICATION
  try {
    await sendEmail({
      to: result.application.user.email as string,
      subject:
        "You have received an admission application request from the school",
      templateName: "application",
      templateData: {
        studentName: result.application.nameEn,

        className: result.application.desiredClass,

        session: result.application.admissionYear,
        applicationId: result.application.applicationNo,
        paymentUrl: session.url,
        currentYear: new Date().getFullYear(),
      },
    });
  } catch (err) {
    console.log(err);
  }

  return {
    application: result.application,
    paymentData: result.paymentData,
    paymentUrl: session.url,
  };
};

const getAllApplication = async (
  searchTerm: string,
  page: number,
  limit: number,
  skip: number,
  sortOrder?: string,
  sortBy: string = "createdAt"

) => {
  //search by status
  const status = searchTerm?.toUpperCase() === "APPROVED"
    ? "APPROVED"
    : searchTerm?.toUpperCase() === "REJECTED"
      ? "REJECTED"
      : searchTerm?.toUpperCase() === "PENDING"
        ? "PENDING"
        : undefined;
  //search by gender
  const gender = searchTerm?.toUpperCase() === "MALE"
    ? "MALE"
    : searchTerm?.toUpperCase() === "FEMALE"
      ? "FEMALE" : undefined

  const andCondition: ApplicationWhereInput[] = [];
  if (searchTerm) {
    andCondition.push({
      OR: [
        {
          user: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          status: {
            equals: status,
          },
        },
        {
          gender: {
            equals: gender,
          },
        },
        {
          nameBn: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          nameEn: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          birthCertificateNo: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          desiredClass: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          applicationNo: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const result = await prisma.application.findMany({
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
    where:
      andCondition.length > 0
        ? {
          AND: andCondition,
        }
        : {
          isDeleted: false,
        },

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
  const totalApplication = await prisma.application.count()
  return {
    data: result,
    meta: {
      limit,
      current_Page: page,
      total_page: Math.ceil(totalApplication / limit),
      total: totalApplication,
    },
  };
};

// const getApplicationById = async (id: string, user: IRequestUser) => {
//   const isApplicationExist = await prisma.application.findUnique({
//     where: {
//       id,
//     },
//   });
//   if (!isApplicationExist) {
//     throw new AppError(status.NOT_FOUND, "Application not found");
//   }
//   if (isApplicationExist.userId !== user.userId) {
//     throw new AppError(status.UNAUTHORIZED, "You are not authorized to view this application");
//   }
//   const result = await prisma.application.findUnique({
//     where: {
//       id,
//     },
//     include: {
//       user: {
//         select: {
//           email: true,
//           status: true,
//         }
//       },
//       payment: {
//         select: {
//           amount: true,
//           paymentFor: true,
//           status: true,
//           transactionId: true,
//           stripeEventId: true,
//         },
//       },
//     },
//   });
//   return result;
// };

const getOwnApplication = async (id: string, user: IRequestUser) => {
  const isApplicationExist = await prisma.application.findUnique({
    where: {
      id,
    },
  });
  if (!isApplicationExist) {
    throw new AppError(status.NOT_FOUND, "Application not found");
  }
  if (isApplicationExist.userId !== user.userId) {
    throw new AppError(status.UNAUTHORIZED, "You are not authorized to view this application");
  }
  const result = await prisma.application.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          email: true,
          status: true,
        }
      },
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
      user: true,
      payment: true,
      student: true,
    },
  });

  if (!isApplicationExist) {
    throw new AppError(status.NOT_FOUND, "Application not found");
  }

  if (isApplicationExist.user.status !== "ACTIVE") {
    throw new AppError(status.BAD_REQUEST, "User is suspended or Inactive");
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

      const classData = await tx.class.findUnique({
        where: {
          name: isApplicationExist.desiredClass,
        },
      });

      if (!classData) {
        throw new AppError(status.NOT_FOUND, "Class not found");
      }

      const lastStudent = await tx.student.findFirst({
        where: {
          classId: classData.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const nextRoll =
        lastStudent && lastStudent.classRoll
          ? Number(lastStudent.classRoll) + 1
          : 1;

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
          profileImage: isApplicationExist.profileImage,
          bloodGroup: isApplicationExist.bloodGroup,
          dob: isApplicationExist.dob,
          gender: isApplicationExist.gender,
          religion: isApplicationExist.religion,
          birthCertificateNo: isApplicationExist.birthCertificateNo,
          classRoll: nextRoll.toString(),
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
      return student;
    });
    //TODO EMAIL SEND AFTER STUDENT CREATE
    try {
      const student = await prisma.student.findUnique({
        where: {
          id: result.id,
        },
        include: {
          class: true,
        },
      });
      await sendEmail({
        to: isApplicationExist.user.email,
        subject: "🎉 Congratulations! Your Admission is Confirmed",
        templateName: "admission-success",
        templateData: {
          studentName: student?.nameEn,
          registrationId: student?.registrationId,
          classRoll: student?.classRoll,
          className: student?.class.name,
          session: new Date().getFullYear().toString(),
          currentYear: new Date().getFullYear(),
        },
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  } catch (error: any) {
    console.log(error);
    const isApplicationExist = await prisma.application.findUnique({
      where: {
        id,
      },
    });
    if (!isApplicationExist) {
      throw new AppError(status.NOT_FOUND, "Application not found");
    }
    await prisma.student.deleteMany({
      where: {
        userId: isApplicationExist.userId,
      },
    });
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      error.message || "Transaction failed",
    );
  }
};

const applicationRejectByAdmin = async (id: string) => {
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
  if (isApplicationExist.status === "APPROVED") {
    throw new AppError(status.BAD_REQUEST, "Application is already accepted");
  }
  const result = await prisma.application.update({
    where: {
      id,
    },
    data: {
      status: "REJECTED",
      updatedAt: new Date(),
    },
  });
  return result;
};

const deleteUnpaidApplications = async () => {
  const targetTime = new Date("2026-05-06T06:00:00+06:00");
  const triggerTime = new Date(targetTime.getTime() - 30 * 60 * 1000);

  const now = new Date();
  if (now >= triggerTime && now <= targetTime) {
    await prisma.application.deleteMany({
      where: {
        paymentStatus: "UNPAID",
        OR: [
          { status: "PENDING" },
          { status: "REJECTED" }
        ]

      },
    });
  }
};
export const ApplicationService = {
  createApplication,
  getAllApplication,
  // getApplicationById,
  getOwnApplication,
  applicationSoftDelete,
  applicationUpdateByAdmin,
  applicationRejectByAdmin,
  deleteUnpaidApplications,
};
