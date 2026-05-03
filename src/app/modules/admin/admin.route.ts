import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateAdminZodSchema } from "./admin.validation";
import { Role } from "../../../generated/prisma/index.js";
import { multerUpload } from "../../config/multer.config";

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
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.single("profilePhoto"),
  validateRequest(updateAdminZodSchema),
  AdminController.updateAdmin,
);

router.delete("/:id", checkAuth(Role.SUPER_ADMIN), AdminController.deleteAdmin);

router.put(
  "/change-user-status/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  AdminController.changeUserStatus,
);

router.put(
  "/change-user-role/:id",
  checkAuth(Role.SUPER_ADMIN),
  AdminController.changeUserRole,
);

export const AdminRoutes = router;
