export interface ICreateMediaPayload {
  description?: string;
  sectionName: string;
  mediaFiles: IMediaFiles[];
}

export interface IMediaFiles {
  key: string;
  url: string;
}
