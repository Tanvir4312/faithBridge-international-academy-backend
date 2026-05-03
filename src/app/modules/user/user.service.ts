import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateAdmin, ICreateTeacherPayload } from "./user.interface";
import { auth } from "../../lib/auth";
import { Role } from "../../../generated/prisma/index.js";
import { UserWhereInput } from "../../../generated/prisma/models";
import { sendEmail } from "../../utils/email";
import { envVars } from "../../config/env";

const createTeacher = async (payload: ICreateTeacherPayload) => {
  const isExitUser = await prisma.user.findUnique({
    where: {
      email: payload.teacher.email,
    },
  });

  if (isExitUser) {
    throw new AppError(status.BAD_REQUEST, "User already exist");
  }

  const userdata = await auth.api.signUpEmail({
    body: {
      name: payload.teacher.name,
      email: payload.teacher.email,
      password: payload.password,
      role: Role.TEACHER,
      needPasswordChange: true,

    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const teacherData = await tx.teacher.create({
        data: {
          userId: userdata.user.id,
          ...payload.teacher,
        },
      });

      await tx.user.update({
        where: {
          id: userdata.user.id,
        },
        data: {
          emailVerified: true,
        },
      });

      const teacher = await tx.teacher.findUnique({
        where: {
          id: teacherData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          contactNumber: true,
          address: true,
          qualification: true,
          gender: true,
          profilePhoto: true,
          isDeleted: true,
          designation: true,
          createdat: true,
          updatedAt: true,
          deletedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              emailVerified: true,
              needPasswordChange: true,
              isDeleted: true,
              deletedAt: true,
            },
          },
        },
      });

      // send email to teacher
      try {
        await sendEmail({
          to: teacherData.email,
          subject: "Account Setup Instructions",
          templateName: "account-onboarding",
          templateData: {
            name: teacherData.name,
            email: teacherData.email,
            password: payload.password,
            loginUrl: `${envVars.FRONTEND_URL}/login`,
            appName: "FaithBridge International Academy",
            currentYear: new Date().getFullYear(),

          },
        });
      } catch (err) {
        console.log(err);
      }
      return teacher;


    });

    return result;
  } catch (err) {
    await prisma.user.delete({
      where: {
        id: userdata.user.id,
      },
    });
    console.log(err);
  }
};

const createAdmins = async (payload: ICreateAdmin) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.admin.email,
    },
  });

  if (isUserExist) {
    throw new AppError(status.BAD_REQUEST, "User already exist");
  }

  const { password, admin, role } = payload;

  const userdata = await auth.api.signUpEmail({
    body: {
      ...admin,
      role,
      password,
      needPasswordChange: true,
    },
  });
  await prisma.user.update({
    where: {
      id: userdata.user.id,
    },
    data: {
      emailVerified: true,
    },
  });

  try {
    const adminData = await prisma.admin.create({
      data: {
        userId: userdata.user.id,
        ...admin,
      },
      include: {
        user: true,
      },
    });

    // send email to admin
    try {
      await sendEmail({
        to: adminData.email,
        subject: "Account Setup Instructions",
        templateName: "account-onboarding",
        templateData: {
          name: adminData.name,
          email: adminData.email,
          password: payload.password,
          loginUrl: `${envVars.FRONTEND_URL}/login`,
          appName: "FaithBridge International Academy",
          currentYear: new Date().getFullYear(),

        },
      });
    } catch (err) {
      console.log(err);
    }
    return adminData;
  } catch (err) {
    console.log(err);
    await prisma.user.delete({
      where: {
        id: userdata.user.id,
      },
    });
  }
};

const getAllUsers = async (searchTerm: string,
  page: number,
  limit: number,
  skip: number,
  sortBy: string,
  sortOrder: string
) => {

  //search by status
  const status = searchTerm?.toUpperCase() === "ACTIVE"
    ? "ACTIVE"
    : searchTerm?.toUpperCase() === "INACTIVE"
      ? "INACTIVE"
      : searchTerm?.toUpperCase() === "SUSPENDED"
        ? "SUSPENDED"
        : undefined;


  //search by role
  const role = searchTerm?.toUpperCase() === "ADMIN"
    ? "ADMIN"
    : searchTerm?.toUpperCase() === "TEACHER"
      ? "TEACHER"
      : searchTerm?.toUpperCase() === "STUDENT"
        ? "STUDENT"
        : searchTerm?.toUpperCase() === "APPLICANT"
          ? "APPLICANT" : undefined

  const andCondition: UserWhereInput[] = [];
  if (searchTerm) {
    andCondition.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          role: {
            equals: role,
          },
        },
        {
          status: {
            equals: status,
          },
        },
      ],
    });
  }
  const result = await prisma.user.findMany({
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: andCondition.length > 0
      ? { AND: andCondition }
      : {},
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
      isDeleted: true,
      deletedAt: true,
    },
  });

  const totalUser = await prisma.user.count();

  return {
    data: result,
    meta: {
      limit,
      current_Page: page,
      total_page: Math.ceil(totalUser / limit),
      total: totalUser,
    },
  };
};
export const UserService = {
  createTeacher,
  createAdmins,
  getAllUsers,
};
