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
