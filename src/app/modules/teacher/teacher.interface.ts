import { Gender } from "../../../generated/prisma/enums";

export interface ITeacherUpadatePayload {
  teacher?: {
    name?: string;
    email?: string;
    contactNumber?: string;
    address?: string;
    qualification?: string;
    gender?: Gender;
    profilePhoto?: string;
    designation?: string;
  };
}


