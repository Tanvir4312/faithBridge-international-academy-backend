import { Router } from "express";
import { ClassDataController } from "./classData.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.post(
  "/create-class",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ClassDataController.createClassData,
);

router.get(
  "/",
  ClassDataController.getallClaasData,
);

export const ClassDataRoutes = router;
