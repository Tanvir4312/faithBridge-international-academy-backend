import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createAdminZodSchema,
  createTeacherValidationSchema,
} from "./user.validation";
// import { checkAuth } from "../../middlewares/checkAuth";
// import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/create-teacher",
  validateRequest(createTeacherValidationSchema),
  UserController.createTeacher,
);

router.post(
  "/create-admin",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createAdminZodSchema),
  UserController.createAdmin,
);

export const UserRoutes = router;
