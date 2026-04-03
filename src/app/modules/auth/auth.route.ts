import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", AuthController.registerApplicant);
router.post("/login", AuthController.loginUser);
router.get(
  "/me",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.APPLICANT),
  AuthController.getMe,
);

router.post("/refresh-token", AuthController.getNewToken);
router.post(
  "/change-password",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.APPLICANT),
  AuthController.changePassword,
);
router.post(
  "/logout",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.APPLICANT),
  AuthController.logoutUser,
);

router.post(
  "/verify-email",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.APPLICANT),
  AuthController.verifyEmail,
);

router.post(
  "/forgot-password",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.APPLICANT),
  AuthController.forgotPassword,
);

router.post("/reset-password", AuthController.resetPassword);

router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);


export const AuthRoutes = router;
