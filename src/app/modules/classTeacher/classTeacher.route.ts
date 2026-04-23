import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { ClassTeacherController } from "./classTeacherController";

const router = Router()

router.post(
    "/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ClassTeacherController.createClassTeacher,
);

export const ClassTeacherRoutes = router