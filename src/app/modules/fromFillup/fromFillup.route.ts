import { Router } from "express";
import { FromFillupController } from "./fromFillup.controller";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.STUDENT),
  FromFillupController.createFromFillup,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  FromFillupController.getAllFromFillup,
);

router.put(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  FromFillupController.updateFromFillUpStatus,
);

router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  FromFillupController.deleteFromFillup,
);

export const FromFillupRoutes = router;
