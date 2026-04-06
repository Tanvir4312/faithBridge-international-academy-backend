export interface ICreateAssignSubjectToTeacher {
  teacherId: string;

  subjectsId: string[];
}

export interface ITeacherPrimarySubjetUpdate {
 teacherId : string;
 subjectId : string
}
export interface ITeacherSubjetDelete {
 teacherId : string;
 subjectId : string
}