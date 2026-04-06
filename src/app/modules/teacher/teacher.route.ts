import { Router } from "express";
import { TeacherController } from "./teacher.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateTeacherValidationSchema } from "./teacher.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TeacherController.getAllTeacher,
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.TEACHER),
  TeacherController.getTeacherById,
);

router.put(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.TEACHER),
  multerUpload.single("profilePhoto"),
  validateRequest(updateTeacherValidationSchema),
  TeacherController.teacherUpdate,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TeacherController.teacherDelete,
);



export const TeacherRoutes = router;
