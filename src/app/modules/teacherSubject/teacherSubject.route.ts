import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { TeacherSubjectController } from "./teacherSubject.controller";

const router = Router();

router.post(
  "/assign-subjects",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TeacherSubjectController.assignSubjectToTeacher,
);

router.patch(
  "/update",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TeacherSubjectController.teacherPrimarySubjectUpdate,
);

router.delete(
  "/delete",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TeacherSubjectController.teacherSubjectDelete,
);

export const TeacherSubjectRoutes = router;
