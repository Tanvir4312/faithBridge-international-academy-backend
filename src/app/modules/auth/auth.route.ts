import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router()

router.post('/register', AuthController.registerApplicant)

export const AuthRoutes = router