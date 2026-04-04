import { Router } from "express";
import { TeacherController } from "./teacher.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateTeacherValidationSchema } from "./teacher.validation";

const router = Router();

router.get("/", TeacherController.getAllTeacher);

router.get("/:id", TeacherController.getTeacherById);

router.put(
  "/:id",
  validateRequest(updateTeacherValidationSchema),
  TeacherController.teacherUpdate,
);

router.delete("/:id", TeacherController.teacherDelete);

export const TeacherRoutes = router;
