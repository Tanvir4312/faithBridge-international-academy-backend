/**
 *   createAcademicLevel,
    getAllAcademicLevel,
    updateAcademicLevel,
    deleteAcademicLevel,
 */

import { Router } from "express";
import { AcademicLevelController } from "./academicLevel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/index.js";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  AcademicLevelCreateZodSchema,
  AcademicLevelUpdateZodSchema,
} from "./academinLevel.validatation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("image"),
  validateRequest(AcademicLevelCreateZodSchema),
  AcademicLevelController.createAcademicLevel,
);
router.get("/", AcademicLevelController.getAllAcademicLevel);
router.get("/:id", AcademicLevelController.getAcademicLevelById);
router.put(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("image"),
  validateRequest(AcademicLevelUpdateZodSchema),
  AcademicLevelController.updateAcademicLevel,
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AcademicLevelController.deleteAcademicLevel,
);

export const AcademicLevelRoutes = router;
