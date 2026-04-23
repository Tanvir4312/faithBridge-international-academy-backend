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

const getAllAdmin = async (page: number,
  limit: number,
  skip: number,
  sortBy: string = "createdAt",
  sortOrder: "desc" | "asc"
) => {

  const result = await prisma.admin.findMany({
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },

    include: {
      user: true,
    },
  });
  const totalAdmin = await prisma.admin.count();
  return {
    data: result,

    meta: {

      limit,
      current_Page: page,
      total_page: Math.ceil(totalAdmin / limit),
      total: totalAdmin,
    }
  };
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

const updateAdmin = async (id: string, payload: IUpdateAdminPayload, userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });




  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }


  if (user?.id !== isAdminExist.userId) {
    throw new AppError(
      status.UNAUTHORIZED,
      "You are not authorized to update other admin only super admin can update all admin",
    );
  }


  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: { ...payload }
  });
  if (payload?.name) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: payload.name,
      },
    });
  }
  return result;
};

//soft delete
const deleteAdmin = async (id: string, user: IRequestUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
  });



  if (userData?.role !== Role.SUPER_ADMIN) {
    throw new AppError(
      status.UNAUTHORIZED,
      "You are not authorized to delete admin user, only super admin can delete admin user",
    );
  }

  if (userData?.role === Role.SUPER_ADMIN) {
    throw new AppError(
      status.UNAUTHORIZED,
      "You are not allowed to delete own Super admin user",
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

  if (isAdminExist.userId === user.userId) {
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
        status: UserStatus.INACTIVE,

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
  id: string
) => {
  // 1. Super admin can change the status of any user (admin, doctor, patient). Except himself. He cannot change his own status.

  // 2. Admin can change the status of doctor and patient. Except himself. He cannot change his own status. He cannot change the status of super admin and other admin user.

  const isSuperAdminExist = await prisma.admin.findUnique({
    where: {
      email: user.email,
      user: {
        role: Role.SUPER_ADMIN,
      },
    },
  });

  if (!isSuperAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  const { userStatus } = payload;

  const userToChangeStatus = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  const selfStatusChange = isSuperAdminExist.userId === userToChangeStatus?.id;

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



  const updateUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: userStatus,
      isDeleted: userStatus === UserStatus.ACTIVE ? false : true,
    },
  });
  return updateUser;
};

const changeUserRole = async (
  user: IRequestUser,
  payload: IChangeUserRolePayload,
  id: string
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

  const { role } = payload;

  const userToChangeRole = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  const selfRoleChange = isSuperAdminExist.userId === userToChangeRole?.id;

  if (selfRoleChange) {
    throw new AppError(status.BAD_REQUEST, "You cannot change your own role");
  }

  const updateUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role: role as Role,
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
