import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router()

router.post('/create-teacher', UserController.createTeacher)

export const UserRoutes = router