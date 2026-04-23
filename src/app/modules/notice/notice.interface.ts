export interface ICreateNoticesPayload {
  title: string;
  details?: string;
  type?: "GENERAL" | "CLASS_SPECIFIC";
  authorId: string;
  noticeClasses: string[];
}
