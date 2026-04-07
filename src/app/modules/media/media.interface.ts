
export interface IMediaFiles {
  key: string;
  url: string;
}

export interface ICreateMediaPayload {
  description?: string;
  sectionName: string;
  mediaFiles: IMediaFiles[];
}