
import express from 'express';
import { Role } from '../../../generated/prisma/index.js';

import { StatsController } from './stats.controller';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

router.get(
    '/',
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN,),
    StatsController.getDashboardStatsData
)


export const StatsRoutes = router;
