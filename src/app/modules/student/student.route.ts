import { Router } from "express";
import { StudentController } from "./student.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/index.js";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateStudentSchema } from "./student.validation";



const router = Router();

router.get(
  "/",

  StudentController.getAllStudent,
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.TEACHER, Role.STUDENT),
  StudentController.getStudentById,
);

router.patch(
  "/update/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.STUDENT),
  multerUpload.single("profileImage"),
  validateRequest(updateStudentSchema),
  StudentController.studentUpdate,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StudentController.studentDelete,
);

export const StudentRoutes = router;
