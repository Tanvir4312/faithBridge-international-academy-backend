import { Gender } from "../../../generated/prisma/enums";
export interface IUpdateSubcetsPayload {
  subjectId: string;
  isDeleted: boolean;
}
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
  subjects?: IUpdateSubcetsPayload[];
}
