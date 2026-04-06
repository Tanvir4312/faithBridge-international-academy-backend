import { Router } from "express";
import { StudentController } from "./student.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.TEACHER),
  StudentController.getAllStudent,
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.TEACHER, Role.STUDENT),
  StudentController.getStudentById,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StudentController.studentDelete,
);

export const StudentRoutes = router;
