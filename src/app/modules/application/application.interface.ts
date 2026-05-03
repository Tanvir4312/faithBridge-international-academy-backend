import { Gender } from "../../../generated/prisma/index.js";

export interface ICreateApplicationPayload {
  nameBn: string;
  nameEn: string;
  fatherName: string;
  motherName: string;
  guardianMobile: string;
  studentMobile?: string;
  dob: Date;
  gender: Gender;
  religion: string;
  bloodGroup?: string;
  birthCertificateNo: string;
  presentAddress: string;
  permanentAddress: string;
  previousSchool?: string;
  desiredClass: string;
  admissionYear: string;
  applicationFee: number;
  profileImage: string;
  signatureImage?: string;
  applicationNo: string;
  createdAt: Date;
}


