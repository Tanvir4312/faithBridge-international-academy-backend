import { Router } from "express";
import { admissionConfigController } from "./admissionConfig.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { admissionConfigSchema, updateAdmissionConfigSchema } from "./admissionConfig.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/index.js";

const router = Router()

router.post(
    "/create-admission-config",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(admissionConfigSchema),
    admissionConfigController.createAdmissionConfig
)
router.get(
    "/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.APPLICANT),
    admissionConfigController.getAllAdmissionConfig
)
router.patch(
    "/update-admission-config/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateAdmissionConfigSchema),
    admissionConfigController.updateAdmissionConfig
)

export const admissionConfigRoutes = router