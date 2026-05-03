import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createAdminZodSchema,
  createTeacherValidationSchema,
} from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.post(
  "/create-teacher",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTeacherValidationSchema),
  UserController.createTeacher,
);

router.post(
  "/create-admin",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(createAdminZodSchema),
  UserController.createAdmin,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getAllUsers,
);

export const UserRoutes = router;
