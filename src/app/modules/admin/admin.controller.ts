import status from "http-status";
import { catchAsync } from "../../shared/cathAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AdminService } from "./admin.service";
import { Request, Response } from "express";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmin();
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Admin fetched successfully",
    success: true,
    data: result,
  });
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AdminService.getAdminById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Admin fetched successfully",
    success: true,
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;

  const result = await AdminService.updateAdmin(id as string, payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Admin updated successfully",
    success: true,
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const result = await AdminService.deleteAdmin(id as string, user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Admin deleted successfully",
    success: true,
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const result = await AdminService.changeUserStatus(user, payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "User status updated successfully",
    success: true,
    data: result,
  });
});

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const result = await AdminService.changeUserRole(user, payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "User role updated successfully",
    success: true,
    data: result,
  });
});

export const AdminController = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  changeUserStatus,
  changeUserRole,
};
