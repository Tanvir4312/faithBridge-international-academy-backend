import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { TeacherRoutes } from "../modules/teacher/teacher.route";
import { SubjectRoutes } from "../modules/subject/subject.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/teacher", TeacherRoutes);
router.use("/subject", SubjectRoutes);

export const IndexRoutes = router;
