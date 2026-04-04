import { Router } from "express";
import { SubjectController } from "./subject.controller";

const router = Router();

router.post("/create-subject", SubjectController.createSubject);

router.get("/", SubjectController.getAllSubject);

router.put("/:id", SubjectController.subjectUpdate);

router.delete("/:id", SubjectController.subjectDelete);

export const SubjectRoutes = router;
