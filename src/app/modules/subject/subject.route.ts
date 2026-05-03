import { Router } from "express";
import { SubjectController } from "./subject.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.post(
  "/create-subject",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SubjectController.createSubject,
);

router.get(
  "/",
  SubjectController.getAllSubject,
);

router.put(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SubjectController.subjectUpdate,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SubjectController.subjectDelete,
);

export const SubjectRoutes = router;
