import { Gender } from "../../../generated/prisma/enums";

export interface ICreateTeacherPayload {
  password: string;
  teacher: {
    name: string;
    email: string;
    contactNumber?: string;
    address?: string;
    qualification: string;
    gender: Gender;
    profilePhoto?: string;
    isDeleted: boolean;
    designation: string;
  };
  
}

export interface ICreateAdmin {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePhoto: string;
    contactNumber: string;
  };
  role: "ADMIN" | "SUPER_ADMIN";
}
