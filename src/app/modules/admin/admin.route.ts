import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateAdminZodSchema } from "./admin.validation";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  AdminController.getAllAdmin,
);

router.get(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  AdminController.getAdminById,
);

router.put(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(updateAdminZodSchema),
  AdminController.updateAdmin,
);

router.delete("/:id", checkAuth(Role.SUPER_ADMIN), AdminController.deleteAdmin);

router.post(
  "/change-user-status",
  checkAuth(Role.SUPER_ADMIN),
  AdminController.changeUserStatus,
);

router.post(
  "/change-user-role",
  checkAuth(Role.SUPER_ADMIN),
  AdminController.changeUserRole,
);

export const AdminRoutes = router;
