
import { Role } from "../../generated/prisma/index.js";

import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { envVars } from "../config/env";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExis = await prisma.user.findFirst({
      where: {
        role: Role.SUPER_ADMIN,
      },
    });

    if (isSuperAdminExis) {
      console.log("⚠️ Super admin already exists");
      return;
    }

    const superAdminData = await auth.api.signUpEmail({
      body: {
        name: "superadmin",
        email: envVars.SUPER_ADMIN_EMAIL,
        password: envVars.SUPER_ADMIN_PASS,
        role: Role.SUPER_ADMIN,
        needPasswordChange: false,
        rememberMe: false,
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: superAdminData.user.id,
        },
        data: {
          emailVerified: true,
        },
      });
      await tx.admin.create({
        data: {
          userId: superAdminData.user.id,
          name: superAdminData.user.name,
          email: superAdminData.user.email,
        },
      });
    });
    const superAdmin = await prisma.admin.findFirst({
      where: {
        email: envVars.SUPER_ADMIN_EMAIL,
      },
      include: {
        user: true,
      },
    });
    console.log("Super admin created successfully", superAdmin);
  } catch (err) {
    console.log(err);
    await prisma.user.delete({
      where: {
        email: envVars.SUPER_ADMIN_EMAIL,
      },
    });
  }
  console.log("🔥 Seed running...");
};
