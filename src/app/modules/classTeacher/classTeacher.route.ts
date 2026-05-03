import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/index.js";
import { ClassTeacherController } from "./classTeacherController";

const router = Router()

router.post(
    "/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ClassTeacherController.createClassTeacher,
);

router.get(
    "/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ClassTeacherController.getAllClassTeacher,
);

router.delete(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ClassTeacherController.deleteClassTeacher,
);



export const ClassTeacherRoutes = router