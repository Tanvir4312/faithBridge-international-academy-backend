import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/index.js";
import { validateRequest } from "../../middlewares/validateRequest";
import { createNoticeSchema } from "./notice.validate";
import { NoticeController } from "./notice.controller";

const router = Router();

router.post(
  "/create-notice",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createNoticeSchema),
  NoticeController.createNotices,
);

router.get(
  "/",

  NoticeController.getAllNotice,
);

router.get(
  "/:id",

  NoticeController.getNoticeById,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  NoticeController.deleteNotice,
);

export const NoticeRoutes = router;
