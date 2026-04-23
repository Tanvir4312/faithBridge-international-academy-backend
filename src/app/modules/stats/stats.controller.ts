
import { Request, Response } from "express";
import status from "http-status";

import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/cathAsync";
import { StatsService } from "./stats.service";


const getDashboardStatsData = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await StatsService.getDashboardStatsData(user);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Stats data retrieved successfully!",
        data: result
    })
});

export const StatsController = {
    getDashboardStatsData
}
