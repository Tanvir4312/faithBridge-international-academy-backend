
import { Role, UserStatus } from "../../../generated/prisma/index.js";

export interface IUpdateAdminPayload {

    name?: string;
    profilePhoto?: string;
    contactNumber?: string;

}

export interface IChangeUserStatusPayload {

    userStatus: UserStatus;
}

export interface IChangeUserRolePayload {

    role: Role;
}