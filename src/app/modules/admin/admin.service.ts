import status from "http-status/nginx";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  IChangeUserRolePayload,
  IChangeUserStatusPayload,
  IUpdateAdminPayload,
} from "./admin.interface";

import { Role, UserStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces/requestUser.inteface";

const getAllAdmin = async () => {
  const result = await prisma.admin.findMany({
    include: {
      user: true,
    },
  });
  return result;
};

const getAdminById = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return result;
};

const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (user?.role !== Role.SUPER_ADMIN) {
    throw new AppError(
      status.UNAUTHORIZED,
      "You are not authorized to update admin user, only super admin can update admin user",
    );
  }

  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  const { admin } = payload;

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      ...admin,
    },
  });
  return result;
};

//soft delete
const deleteAdmin = async (id: string, user: IRequestUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (userData?.role !== Role.SUPER_ADMIN) {
    throw new AppError(
      status.UNAUTHORIZED,
      "You are not authorized to delete admin user, only super admin can delete admin user",
    );
  }

  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  if (isAdminExist.id === user.userId) {
    throw new AppError(status.BAD_REQUEST, "You cannot delete yourself");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    await tx.user.update({
      where: {
        id: isAdminExist.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.session.deleteMany({
      where: {
        userId: isAdminExist.userId,
      },
    });

    await tx.account.deleteMany({
      where: {
        userId: isAdminExist.userId,
      },
    });
    const admin = getAdminById(id);
    return admin;
  });
  return result;
};

const changeUserStatus = async (
  user: IRequestUser,
  payload: IChangeUserStatusPayload,
) => {
  // 1. Super admin can change the status of any user (admin, doctor, patient). Except himself. He cannot change his own status.

  // 2. Admin can change the status of doctor and patient. Except himself. He cannot change his own status. He cannot change the status of super admin and other admin user.

  const isAdminExist = await prisma.admin.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  const { userId, userStatus } = payload;

  const userToChangeStatus = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const selfStatusChange = isAdminExist.id === userId;

  if (selfStatusChange) {
    throw new AppError(status.BAD_REQUEST, "You cannot change your own status");
  }

  if (
    user.role === Role.ADMIN &&
    userToChangeStatus?.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      "You cannot change the status of super admin user",
    );
  }

  if (user.role === Role.ADMIN && userToChangeStatus?.role === Role.ADMIN) {
    throw new AppError(
      status.BAD_REQUEST,
      "You cannot change the status of other admin user",
    );
  }

  if (userStatus === UserStatus.SUSPENDED) {
    throw new AppError(
      status.BAD_REQUEST,
      "You cannot set user status to deleted. To delete a user, you have to use role specific delete api. For example, to delete an doctor user, you have to use delete doctor api which will set the user status to deleted and also set isDeleted to true and also delete the user session and account",
    );
  }

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: userStatus,
    },
  });
  return updateUser;
};

const changeUserRole = async (
  user: IRequestUser,
  payload: IChangeUserRolePayload,
) => {
  const isSuperAdminExist = await prisma.admin.findUnique({
    where: {
      email: user.email,
      user: {
        role: Role.SUPER_ADMIN,
      },
    },
  });

  if (!isSuperAdminExist) {
    throw new AppError(status.NOT_FOUND, "Super admin not found");
  }

  const { userId, role } = payload;

  const userToChangeRole = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const selfRoleChange = isSuperAdminExist.id === userId;

  if (selfRoleChange) {
    throw new AppError(status.BAD_REQUEST, "You cannot change your own role");
  }

  if (user.role === Role.APPLICANT || userToChangeRole?.role === Role.STUDENT) {
    throw new AppError(
      status.BAD_REQUEST,
      "You cannot change the role of doctor or patient user. If you want to change the role of doctor or patient user, you have to delete the user and recreate with new role",
    );
  }

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
     role: role as unknown as Role,
    },
  });
  return updateUser;
};

export const AdminService = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  changeUserStatus,
  changeUserRole,
};
