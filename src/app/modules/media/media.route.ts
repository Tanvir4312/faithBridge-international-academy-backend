import { NextFunction, Request, Response, Router } from "express";
import { MediaController } from "./media.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/upload",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.fields([{ name: "media", maxCount: 10 }]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      const parsData = JSON.parse(req.body.data);
      req.body = { ...req.body, ...parsData };
    }
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[] | undefined;
    };

    if (files?.media && files?.media.length > 0) {
      const newMedia = files.media.map((file) => ({
        key: file.originalname || `school media - ${new Date().getTime()}`,
        url: file.path,
      }));

      req.body.mediaFiles = newMedia;
    }
    next();
  },
  MediaController.createMedia,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  MediaController.getAllMedia,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  MediaController.deleteMedia,
);

export const MediaRoutes = router;
