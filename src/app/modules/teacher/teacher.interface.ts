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

export interface ITeacherFilterRequest {
  searchTerm?: string;
  gender?: string;
  designation?: string;
  subject?: string;
  isPrimary?: string;
  class?: string;
}


