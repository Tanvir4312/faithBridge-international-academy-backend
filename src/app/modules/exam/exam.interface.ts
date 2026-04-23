

export interface IExamCreatePayload {
  id: string;
  name: string;
  year: string;
  formFillupStart: Date;
  formFillupEnd: Date;
  examDate?: Date;
}

export interface IExamUpdatePayload {

  name?: string;
  year?: string;
  formFillupStart?: Date;
  formFillupEnd?: Date;
  examDate?: Date;
}