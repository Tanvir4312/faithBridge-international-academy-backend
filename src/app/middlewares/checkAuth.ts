/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/index.js";
import { cookieUtils } from "../utils/cookie";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new Error("Unauthorized access! No session token provided.");
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: { gt: new Date() },
          },
          include: { user: true },
        });

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
          }

          if (user.status !== UserStatus.ACTIVE || user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              "User is not active or deleted.",
            );
          }

        
          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };
        }
      }

      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!req.user && !accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized! No valid session or token found.",
        );
      }

      if (accessToken) {
        const verifiedToken = jwtUtils.verifyToken(
          accessToken,
          envVars.ACCES_TOKEN_SECRET,
        );

        if (verifiedToken.success) {
          if (!req.user) {
            const tokenData = verifiedToken.data as any;
            req.user = {
              userId: tokenData.userId,
              role: tokenData.role,
              email: tokenData.email,
            };
          }
        } else if (!req.user) {
          throw new AppError(status.UNAUTHORIZED, "Invalid access token.");
        }
      }

      if (authRoles.length > 0 && req.user) {
        if (!authRoles.includes(req.user.role as Role)) {
          throw new AppError(
            status.FORBIDDEN,
            "Forbidden! You don't have permission.",
          );
        }
      }

      if (!req.user) {
        throw new AppError(status.UNAUTHORIZED, "User context not found.");
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
