import { Gender } from "../../../generated/prisma/enums";

export interface ITeacherUpadatePayload {

  name?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
  qualification?: string;
  profilePhoto?: string;
  designation?: string;

}


