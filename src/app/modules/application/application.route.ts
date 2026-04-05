import { Router } from "express";
import { ApplicationController } from "./application.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createStudentApplicationSchema } from "./application.validation";

const router = Router();

router.post(
  "/create-application",
  checkAuth(Role.APPLICANT),
  validateRequest(createStudentApplicationSchema),
  ApplicationController.createApplication,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ApplicationController.getAllApplication,
);
router.get(
  "/my-application/:id",
  checkAuth(Role.APPLICANT),
  ApplicationController.getOwnApplication,
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.APPLICANT),
  ApplicationController.getApplicationById,
);

router.delete(
  "/delete/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ApplicationController.applicationSoftDelete,
);

router.put(
  "/update/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),

  ApplicationController.applicationUpdateByAdmin,
);

export const ApplicationRoutes = router;
