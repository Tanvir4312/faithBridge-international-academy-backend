import { Router } from "express";
import { ExamController } from "./exam.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { examSchema } from "./exam.validation";

const router = Router();

router.post(
  "/create-exam",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(examSchema),
  ExamController.createExam,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ExamController.getAllExam,
);

export const ExamRoutes = router;
