import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/index.js";
import { PaymentController } from "./payment.controller";

const router = Router()

router.get(
    "/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    PaymentController.getAllPayment
)
router.get(
    "/:studentId",
    checkAuth(Role.SUPER_ADMIN, Role.STUDENT),
    PaymentController.getPaymentByStudentId
)
router.get(
    "/applicant/:applicantId",
    checkAuth(Role.SUPER_ADMIN, Role.APPLICANT),
    PaymentController.getPaymentByApplicantId
)

export const PaymentRoutes = router