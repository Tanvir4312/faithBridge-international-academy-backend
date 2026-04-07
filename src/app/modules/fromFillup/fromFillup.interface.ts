export interface ICreateFromFillupPayload {
  studentId: string;
  classId: string;
  examId: string;
  registrationNo: string;
  classRoll: string;
}

export interface IUpdateFromFillupStatusPayload {
  status: "APPROVED" | "REJECTED";
}

export interface AdmitCardData {
  studentId: string;
  classId: string;
  examId: string;
  registrationNo: string;
  classRoll: string;
  nameBn: string;
  nameEn: string;
  fatherName: string;
  motherName: string;
  createdAt : Date
}
