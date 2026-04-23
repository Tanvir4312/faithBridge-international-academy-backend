import { Router } from "express";
import { ExamController } from "./exam.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { examSchema, examUpdateSchema } from "./exam.validation";

const router = Router();

router.post(
  "/create-exam",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(examSchema),
  ExamController.createExam,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.STUDENT),
  ExamController.getAllExam,
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(examUpdateSchema),
  ExamController.updateExam,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ExamController.deleteExam,
);

export const ExamRoutes = router;
