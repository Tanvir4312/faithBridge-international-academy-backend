import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { TeacherRoutes } from "../modules/teacher/teacher.route";
import { SubjectRoutes } from "../modules/subject/subject.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { ApplicationRoutes } from "../modules/application/application.route";
import { StudentRoutes } from "../modules/student/student.route";
import { TeacherSubjectRoutes } from "../modules/teacherSubject/teacherSubject.route";
import { MediaRoutes } from "../modules/media/media.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/teacher", TeacherRoutes);
router.use("/subject", SubjectRoutes);
router.use("/admin", AdminRoutes);
router.use("/application", ApplicationRoutes);
router.use("/student", StudentRoutes);
router.use("/teacher-subject", TeacherSubjectRoutes);
router.use("/media", MediaRoutes);

export const IndexRoutes = router;
